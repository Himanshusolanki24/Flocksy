import sys
import os
sys.path.append("/Users/himanshusolanki/Desktop/Rion/Flocksy/ai-core")
os.chdir("/Users/himanshusolanki/Desktop/Rion/Flocksy/ai-core")
import asyncio
from app.schemas import AnalyzeRequest, FarmContext
from app.agents.orchestrator import Orchestrator

async def main():
    from dotenv import load_dotenv
    load_dotenv()
    
    o = Orchestrator()
    r = AnalyzeRequest(symptoms="test", context=FarmContext(farmId="farm-demo-1"))
    try:
        res = await o.run(r)
        print("Success!")
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
