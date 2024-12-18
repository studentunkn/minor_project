# Using python we get only one line of DNA and get RNA and amnio acid  
===  
`main.py`
```python
import time, RNA_encode, pro
def err(err_num):
    if err_num == 2: print("This triplet is missing start or stop triplet.") 
DNA_1 = input("What is the code?")
DNA_2= []
for base in DNA_1:
    if base == "A": DNA_2.append("T")
    elif base == "T": DNA_2.append("A")
    elif base == "G": DNA_2.append("C")
    elif base == "C": DNA_2.append("G")
    else:
        print("Error: this is not the DNA code.")
        exit()
DNA_2 = ''.join(DNA_2)

print("Loading DNA ...")
time.sleep(2)
print('┌' + '┬'.join(DNA_1) + '┐')
print('└' + '┴'.join(DNA_2) + '┘')
print("")
template = input("What is the template DNA?(up or down)")
if template == "up" or template == "UP": RNA = RNA_encode.RNA(DNA_1)
if template == "down" or template == "DOWN": RNA = RNA_encode.RNA(DNA_2)
print("RNA code: "+'├' + '―'.join(RNA) +'┤')

amino_acid = pro.amino_acid(RNA)

for base in amino_acid:
    base.count("AUG")
```
`RNA_encode.py`
```
def RNA(DNA):
    RNA = []
    for base in DNA:
        if base == "A": RNA.append("U")
        elif base == "T": RNA.append("A")
        elif base == "G": RNA.append("C")
        elif base == "C": RNA.append("G")
        else:
            print("Error: this is not the DNA code.")
            exit()
    return ''.join(RNA)
```
