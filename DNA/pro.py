def amino_acid(RNA):
    # RNA를 3개씩 잘라서 코돈 리스트 만들기
    codon = [RNA[i:i+3] for i in range(0, len(RNA) - len(RNA) % 3, 3)]
    
    # 아미노산을 매핑한 딕셔너리
    codon_dict = {
        'UUU': "Phenylalanine", 'UUC': "Phenylalanine", 
        'UUA': "Leucine", 'UUG': "Leucine", 
        'CUU': "Leucine", 'CUC': "Leucine", 
        'CUA': "Leucine", 'CUG': "Leucine", 
        'AUU': "Isoleucine", 'AUC': "Isoleucine", 
        'AUA': "Isoleucine", 'AUG': "Methionine (start)", 
        'GUU': "Valine", 'GUC': "Valine", 
        'GUA': "Valine", 'GUG': "Valine", 
        'UCU': "Serine", 'UCC': "Serine", 
        'UCA': "Serine", 'UCG': "Serine", 
        'CCU': "Proline", 'CCC': "Proline", 
        'CCA': "Proline", 'CCG': "Proline", 
        'ACU': "Threonine", 'ACC': "Threonine", 
        'ACA': "Threonine", 'ACG': "Threonine", 
        'GCU': "Alanine", 'GCC': "Alanine", 
        'GCA': "Alanine", 'GCG': "Alanine", 
        'UAU': "Tyrosine", 'UAC': "Tyrosine", 
        'UAA': "Stop codon", 'UAG': "Stop codon", 
        'UGU': "Cysteine", 'UGC': "Cysteine", 
        'UGA': "Stop codon", 'UGG': "Tryptophan", 
        'CGU': "Arginine", 'CGC': "Arginine", 
        'CGA': "Arginine", 'CGG': "Arginine", 
        'AGU': "Serine", 'AGC': "Serine", 
        'AGA': "Arginine", 'AGG': "Arginine", 
        'GGU': "Glycine", 'GGC': "Glycine", 
        'GGA': "Glycine", 'GGG': "Glycine", 
        'GAU': "Aspartic acid", 'GAC': "Aspartic acid", 
        'GAA': "Glutamic acid", 'GAG': "Glutamic acid",
        'AAA': "Lysine", 'AAG': "Lysine",
        'CAU': "Histidine", 'CAC': "Histidine",
        'CAA': "Glutamine", 'CAG': "Glutamine",
        'AAU': "Asparagine", 'AAC': "Asparagine"
        }

    
    # 각 코돈에 대해 대응되는 아미노산 리스트 생성
    protein = []
    for triplet in codon:
        #print(triplet)
        protein.append(codon_dict.get(triplet))
    return codon, protein
