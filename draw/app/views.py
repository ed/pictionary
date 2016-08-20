from flask import render_template, redirect, url_for
from app import app
import numpy as np
import uuid

def id_gen():
    a = uuid.uuid4().int
    while (len(str(a)) > 6):
        z = int(len(str(a))/2)-1
        b = int(str(a)[0:z])
        c = int(str(a)[z:-1])
        a = b^c
    return(np.base_repr(a,36).lower())

@app.route('/_spawn')
def spawn_room(players=8, game='draw'):
    token = id_gen()
    redirect(url_for('home', t=token))

@app.route('/')
def home():
    spawn_room()
    return render_template('draw.html')
