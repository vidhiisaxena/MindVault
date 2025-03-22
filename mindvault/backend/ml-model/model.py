from datasets import load_dataset
from transformers import BartForConditionalGeneration, BartTokenizer
from transformers import pipeline
from transformers import Trainer, TrainingArguments
from transformers import AutoTokenizer
from transformers import DataCollatorWithPadding
from torch.utils.data import DataLoader

# Load dataset
dataset = load_dataset("squad", split="train")

# Load tokenizer and model
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")

def generate_flashcard(text):
    inputs = tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = model.generate(inputs, max_length=150, min_length=30, length_penalty=2.0, num_beams=4)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)


# Load a pre-trained question generator
question_generator = pipeline("text2text-generation", model="t5-small")


training_args = TrainingArguments(
    output_dir="./results",
    eval_strategy="no",
    save_strategy="epoch",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=10,
    remove_unused_columns=False 
)
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)


trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,  
    tokenizer=tokenizer,  
    data_collator=data_collator  
)

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

def preprocess_function(examples):
    model_inputs = tokenizer(
        examples["context"], examples["question"], truncation=True, padding="max_length"
    )
    
    # Handling answers (for QA datasets)
    if "answers" in examples:
        model_inputs["labels"] = [ans["text"][0] if ans["text"] else "" for ans in examples["answers"]]
    
    return model_inputs

dataset = dataset.map(preprocess_function, batched=True, remove_columns=["title", "id", "answers", "question", "context"])
print(dataset)
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
data_collator = DataCollatorWithPadding(tokenizer=tokenizer, return_tensors="pt")

train_dataloader = DataLoader(
    dataset,
    batch_size=8, 
    shuffle=True, 
    collate_fn=data_collator
)


trainer.train()
