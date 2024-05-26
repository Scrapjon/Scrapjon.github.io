import random
import time
import arrr
from pyscript import document


class Person:
    #initialise values
    def __init__(self, name = 'person', health=100, strength=0, dexterity=0, constitution=0, intellegence = 0, wisdom = 0, charisma = 0):
        self.name = name
        self.health = health
        self.strength = strength
        self.dexterity = dexterity
        self.constitution = constitution
        self.intellegence = intellegence
        self.wisdom = wisdom
        self.charisma = charisma

    def isAlive(self):
        return self.health > 0

    def attack(self, opponent):
        

        #calculate damage:
        if self.strength - opponent.constitution/2 <=0:
            atkPower=0
            return 'not taken damage'
        else:
            atkPower = self.strength - opponent.constitution/2
        opponent.health -= atkPower

        if(opponent.isAlive()):
            return f'{opponent.health} health remaining'
        else:
            return 'died'

trainingDummy = Person(name='Training Dummy', health=100)

def combat(Person1, Person2):
        output = ''
        output += arrr.translate(f'{Person1.name} punches {Person2.name}') + "\n"
        output += arrr.translate(f'{Person2.name} has {Person1.attack(Person2)}!') + "\n"
        output += arrr.translate(f'{Person2.name} attacks {Person1.name}') + "\n"
        output += arrr.translate(f'{Person1.name} has {Person2.attack(Person1)}!') + "\n"

        return output

def buttonInteract(event):
    input_text = document.querySelector("#nameInput")
    if input_text.value == '':
        output_div = document.querySelector("#output")
        output_div.innerText = f'{trainingDummy.name} stands alone without an opponent'
        return
    else:
        playerName = input_text.value
        Player = Person(name=playerName, health=100, strength=20, dexterity=2, constitution=10, intellegence=3, wisdom=2, charisma=12)
        output_div = document.querySelector("#output")
        output_div.innerText = combat(Player, trainingDummy)
        return
    
        







    


    
    