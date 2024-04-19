from notebook import model

def _filename(path):
    return path.name

def _id(path):
    return path.stem

def _title(path):
    return path.stem.title()

def _content(path):
    return path.read_text(encoding="utf-8")

def create(path):
    return model.Page(_id(path), _filename(path), _title(path), _content(path))
