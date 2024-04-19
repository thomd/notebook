
def getFilename(path):
    return path.name

def getId(path):
    return path.stem

def getTitle(path):
    return path.stem.title()

def getContent(path):
    return path.read_text(encoding="utf-8")

