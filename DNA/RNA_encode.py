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