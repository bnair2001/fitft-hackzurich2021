from fastapi import FastAPI
from PIL import Image
from fastapi.staticfiles import StaticFiles
from os import path

app = FastAPI()

app.mount("/generated", StaticFiles(directory="generated"), name="generated")

PANEL = "./assets/panel.png"

pos_dict = {
    "1": (0,0),
    "2": (256,0),
    "3": (512,0),
    "4": (0, 256),
    "5": (256, 256),
    "6": (512, 256),
    "7": (0, 512),
    "8": (256, 512),
    "9": (512, 512)
}

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/image/{patt_id}")
async def image(patt_id):
    if not path.exists("./generated/"  + patt_id + ".png"):
        string_to_pattern(patt_id).save("./generated/"  + patt_id + ".png")

    return {"link": "https://fitft-111.herokuapp.com/generated/" + patt_id + ".png"}


def position(pattern, pos, bg = Image.open(PANEL)):
    if pattern != "00":
        pt = Image.open("./assets/pattern"+pattern+".png").convert("RGBA")

        bg.paste(pt, pos_dict[pos], mask=pt)
        
        return bg
    else:
        return bg

def string_to_pattern(string):
    cursor = 2
    pos = 1
    bg = Image.open(PANEL)
    for i in range(0, 9):
        bg = position(string[(cursor - 2):cursor], str(pos), bg)
        cursor += 2
        pos += 1
    return bg