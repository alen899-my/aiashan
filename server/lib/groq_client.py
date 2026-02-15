from openai import OpenAI
from core.config import settings

# Initializing the client for Groq LPU
client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

def generate_ashan_plan(user_data: dict):
    # Use Llama 3.3 70B for high-quality reasoning on Groq's LPU
    MODEL_ID = "llama-3.3-70b-versatile" 

    system_prompt = (
        "You are AI Ashan, an elite strength coach. "
        "Create a concise 7-day workout split, recovery, and nutrition plan based on user biometrics. "
        "Format: Markdown, bold headers, bullet points. Keep it punchy and direct."
    )
    
    user_prompt = (
        f"PROFILE: {user_data.get('first_name')}, {user_data.get('age')}y, {user_data.get('weight')}kg, {user_data.get('height')}cm. "
        f"GOAL: {user_data.get('goal')}. LEVEL: {user_data.get('experience')}. FREQ: {user_data.get('frequency')}d/wk."
    )

    try:
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.5, # Lower temp for more focused output
            max_tokens=1024 # Optimized token limit
        )
        return response.choices[0].message.content
    except Exception as e:
        # Logging error to console for your debugging
        print(f"CRITICAL AI ERROR: {str(e)}")
        # If Grok is unreachable, return this fallback text so registration succeeds
        return (
            "### SYSTEM CALIBRATION IN PROGRESS\n"
            "Your warrior profile has been saved. Our AI core (Groq) is currently "
            "optimizing your data. Please check your dashboard in 5 minutes for "
            "your full tactical plan."
        )