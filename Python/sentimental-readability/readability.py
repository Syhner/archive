from cs50 import get_string

text = get_string("Text: ")

letters = sentences = 0
words = 1

for char in text:
    if char.isalpha():
        letters += 1
    elif char == ' ':
        words += 1
    elif char == '.' or char == '?' or char == '!':
        sentences += 1

lpw = letters / words * 100
spw = sentences / words * 100
index = 0.0588 * lpw - 0.296 * spw - 15.8
grade = round(index)

if grade < 1:
    print("Before Grade 1")
elif grade >= 16:
    print("Grade 16+")
else:
    print("Grade " + str(grade))