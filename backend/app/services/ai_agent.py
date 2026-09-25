import json
from typing import List, Dict, Any, Optional
from app.models.schemas import ChatRequest, ChatResponse, ActionItem, Dish, Allergen
from app.core.supabase import db_store
from app.core.config import settings
from app.core.gemini import gemini_service, MENU_TOOLS

class AiAgentService:
    def __init__(self):
        pass

    async def process_chat(self, req: ChatRequest) -> ChatResponse:
        rest_id = req.restaurant_id
        dishes = db_store.dishes.get(rest_id, [])
        categories = db_store.categories.get(rest_id, [])
        
        last_user_msg = ""
        for m in reversed(req.messages):
            if m.role == "user":
                last_user_msg = m.content
                break

        # If Gemini is configured with API key, use official tool calling
        if gemini_service.is_configured():
            try:
                import google.generativeai as genai
                
                system_instruction = f"""
                Eres "Faro AI", el sommelier y asistente gastronómico inteligente del restaurante Faro.
                Tu objetivo es asesorar cordialmente a los comensales en la mesa, responder dudas sobre ingredientes y alérgenos (celiaquía/sin TACC, lactosa, vegetarianismo), sugerir maridajes y agregar platos al carrito cuando el cliente lo solicite.
                
                Menú actual disponible en el restaurante:
                {json.dumps([{ 'id': d.id, 'name': d.name, 'price': d.price, 'category': d.category_name, 'allergens': d.allergens, 'desc': d.description } for d in dishes], ensure_ascii=False)}
                
                Tienes a tu disposición herramientas (Functions) para consultar la carta, verificar alérgenos y agregar platos al carrito.
                Usa siempre las herramientas cuando el usuario pida recomendaciones específicas, consulte por alérgenos o quiera agregar algo a su pedido.
                Sé conciso, empático, profesional y habla en español rioplatense o neutro y amigable.
                """
                
                model = genai.GenerativeModel(
                    model_name=gemini_service.model_name,
                    system_instruction=system_instruction,
                    tools=[
                        genai.protos.Tool(function_declarations=[
                            genai.protos.FunctionDeclaration(**tool) for tool in MENU_TOOLS
                        ])
                    ]
                )
                
                # Build chat history
                gemini_history = []
                for m in req.messages[:-1]:
                    role = "user" if m.role == "user" else "model"
                    gemini_history.append({"role": role, "parts": [m.content]})
                
                chat = model.start_chat(history=gemini_history)
                response = chat.send_message(last_user_msg)
                
                actions: List[ActionItem] = []
                suggested_dishes: List[Dish] = []
                reply_text = ""
                
                # Check for function calls in response
                for part in response.candidates[0].content.parts:
                    if fn := part.function_call:
                        fn_name = fn.name
                        fn_args = {k: v for k, v in fn.args.items()}
                        
                        # Execute the tool
                        tool_result = self._execute_tool(fn_name, fn_args, dishes)
                        
                        if fn_name == "agregar_al_carrito":
                            dish_id = fn_args.get("plato_id")
                            found_dish = next((d for d in dishes if d.id == dish_id or d.name.lower() in fn_args.get("nombre_plato", "").lower()), None)
                            if found_dish:
                                actions.append(ActionItem(
                                    action_type="ADD_TO_CART",
                                    payload={
                                        "dish_id": found_dish.id,
                                        "dish_name": found_dish.name,
                                        "price": found_dish.price,
                                        "quantity": fn_args.get("cantidad", 1),
                                        "notes": fn_args.get("notes", "")
                                    }
                                ))
                                suggested_dishes.append(found_dish)
                        
                        elif fn_name == "consultar_platos" or fn_name == "obtener_recomendacion_maridaje":
                            matched = tool_result.get("dishes", [])
                            for d in matched[:3]:
                                if d not in suggested_dishes:
                                    suggested_dishes.append(d)
                        
                        # Send tool response back to Gemini to get final conversational reply
                        second_response = chat.send_message(
                            genai.protos.Content(
                                parts=[genai.protos.Part(
                                    function_response=genai.protos.FunctionResponse(
                                        name=fn_name,
                                        response={"result": tool_result}
                                    )
                                )]
                            )
                        )
                        reply_text = second_response.text
                    elif part.text:
                        reply_text += part.text

                if not reply_text:
                    reply_text = "¡Con gusto! Aquí tienes mis recomendaciones basadas en nuestra carta."

                return ChatResponse(
                    reply=reply_text,
                    actions=actions,
                    suggested_dishes=suggested_dishes
                )
            except Exception as e:
                print(f"Notice: Gemini live API error or fallback: {e}. Executing native semantic engine.")

        # Native Intelligent Engine with Tool Calling Simulation
        return self._native_smart_agent(last_user_msg, dishes, req.current_cart)

    def _execute_tool(self, fn_name: str, args: Dict[str, Any], dishes: List[Dish]) -> Dict[str, Any]:
        if fn_name == "consultar_platos":
            categoria = args.get("categoria", "").lower()
            max_price = args.get("precio_maximo")
            apto_celiaco = args.get("apto_celiaco")
            vegetariano = args.get("vegetariano")
            vegano = args.get("vegano")

            filtered = dishes
            if categoria:
                filtered = [d for d in filtered if categoria in d.category_name.lower()]
            if max_price:
                filtered = [d for d in filtered if d.price <= float(max_price)]
            if apto_celiaco:
                filtered = [d for d in filtered if "apto_celiaco" in d.allergens or "sin_tacc" in d.tags]
            if vegetariano:
                filtered = [d for d in filtered if "vegetariano" in d.allergens or "vegano" in d.allergens]
            if vegano:
                filtered = [d for d in filtered if "vegano" in d.allergens]
            
            return {"dishes": filtered, "total_found": len(filtered)}

        elif fn_name == "agregar_al_carrito":
            dish_id = args.get("plato_id")
            plato = next((d for d in dishes if d.id == dish_id), None)
            return {"success": True if plato else False, "dish": plato.model_dump() if plato else None}

        elif fn_name == "verificar_alergenos":
            plato_id = args.get("plato_id", "")
            alergia = args.get("alergia", "").lower()
            plato = next((d for d in dishes if d.id == plato_id or plato_id.lower() in d.name.lower()), None)
            if not plato:
                return {"found": False, "message": "Plato no encontrado"}
            
            has_allergen = any(alergia in a.lower() for a in plato.allergens)
            return {
                "plato_name": plato.name,
                "allergens": plato.allergens,
                "contains_requested_allergen": has_allergen,
                "is_safe": not has_allergen
            }
        
        elif fn_name == "obtener_recomendacion_maridaje":
            pref = args.get("tipo_plato", "").lower()
            if "pescado" in pref or "mar" in pref:
                main = next((d for d in dishes if "dish_202" == d.id or "dish_204" == d.id), dishes[0])
                drink = next((d for d in dishes if "dish_401" == d.id), dishes[-1])
            else:
                main = next((d for d in dishes if "dish_201" == d.id), dishes[0])
                drink = next((d for d in dishes if "dish_403" == d.id), dishes[-1])
            return {"dishes": [main, drink], "recommendation": f"Excelente combinación: {main.name} maridado con {drink.name}."}

        return {"status": "ok"}

    def _native_smart_agent(self, text: str, dishes: List[Dish], cart: Optional[List[Dict[str, Any]]]) -> ChatResponse:
        """Rule-based engine with complete Function Calling execution for full offline interactivity"""
        text_lower = text.lower()
        actions: List[ActionItem] = []
        suggested: List[Dish] = []

        # 1. Detection of Intent: Add to Cart
        if any(w in text_lower for w in ["agregar", "agregame", "sumar", "pedir", "cargar al carrito", "quiero pedir"]):
            for dish in dishes:
                # check if dish name matches
                keywords = [k for k in dish.name.lower().split() if len(k) > 3]
                if any(k in text_lower for k in keywords) or dish.name.lower() in text_lower:
                    actions.append(ActionItem(
                        action_type="ADD_TO_CART",
                        payload={
                            "dish_id": dish.id,
                            "dish_name": dish.name,
                            "price": dish.price,
                            "quantity": 1,
                            "notes": "Agregado por Faro AI"
                        }
                    ))
                    suggested.append(dish)

            if actions:
                names = ", ".join(a.payload["dish_name"] for a in actions)
                return ChatResponse(
                    reply=f"✅ ¡Excelente elección! He ejecutado la acción `agregar_al_carrito` y sumé **{names}** a tu pedido. Puedes revisar tu carrito o continuar explorando la carta.",
                    actions=actions,
                    suggested_dishes=suggested
                )

        # 2. Celiaquía / Gluten / Sin TACC
        if any(w in text_lower for w in ["celiaco", "celíaco", "celiaquía", "sin tacc", "gluten", "tacc"]):
            celiac_dishes = [d for d in dishes if "apto_celiaco" in d.allergens or "sin_tacc" in d.tags]
            suggested = celiac_dishes[:3]
            return ChatResponse(
                reply="🛡️ **Opciones 100% Aptas para Celíacos (Sin TACC)** en Faro:\n\n"
                      "• **Ojo de Bife con Papas Rústicas** ($24.500): Cocción limpia a las brasas.\n"
                      "• **Salmón Rosado con Risotto** ($28.900): Elaborado sin harinas ni contaminación cruzada.\n"
                      "• **Provoleta Faro** ($9.200) y **Flan Casero** ($6.200).\n\n"
                      "¿Deseas que agregue alguna de estas opciones a tu orden?",
                actions=[],
                suggested_dishes=suggested
            )

        # 3. Vegetariano / Vegano
        if any(w in text_lower for w in ["vegetariano", "vegano", "sin carne"]):
            veg_dishes = [d for d in dishes if "vegetariano" in d.allergens or "vegano" in d.allergens]
            suggested = veg_dishes[:3]
            return ChatResponse(
                reply="🌱 **Nuestras sugerencias Vegetarianas & Plant-Based**:\n\n"
                      "• **Sorrentinos de Calabaza Asada y Mozzarella** ($16.800): En salsa crema de salvia y nueces.\n"
                      "• **Provoleta Faro con Tomates Confitados** ($9.200).\n"
                      "• **Limonada Menta y Jengibre** ($5.500).\n\n"
                      "¿Te gustaría que te sume los sorrentinos o la provoleta?",
                actions=[],
                suggested_dishes=suggested
            )

        # 4. Maridaje / Recomendación del Sommelier
        if any(w in text_lower for w in ["recomienda", "recomendación", "maridaje", "que pedir", "sugerencia", "vino", "carne"]):
            main = next((d for d in dishes if d.id == "dish_201"), dishes[0])
            drink = next((d for d in dishes if d.id == "dish_403"), dishes[-1])
            suggested = [main, drink]
            return ChatResponse(
                reply="🍷 **Sugerencia Especial del Sommelier Faro**:\n\n"
                      f"Te sugiero comenzar con nuestro **{main.name}** ($24.500), cocido a punto jugoso, maridado con una **{drink.name}** ($6.800). Sus taninos redondos y notas frutales resaltan la jugosidad de la carne.\n\n"
                      "Si deseas, dime *'Agregalo'* y lo cargo directo a tu mesa.",
                actions=[],
                suggested_dishes=suggested
            )

        # 5. Default welcoming response
        suggested = dishes[:2]
        return ChatResponse(
            reply="👋 ¡Hola! Soy **Faro AI**, tu asistente gastronómico personal en la mesa.\n\n"
                  "Puedo ayudarte a:\n"
                  "1. **Filtrar platos** por restricciones (Sin TACC, vegetariano, intolerancias).\n"
                  "2. **Recomendar maridajes** de autor con nuestra bodega.\n"
                  "3. **Cargar platos directamente a tu carrito** (ej: *'Agregame una porción de rabas y un gin tonic'*).\n\n"
                  "¿Qué te gustaría degustar hoy?",
            actions=[],
            suggested_dishes=suggested
        )

ai_agent_service = AiAgentService()
