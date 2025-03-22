from datasets import load_dataset
from transformers import BartForConditionalGeneration, BartTokenizer, TrainingArguments, Trainer
from transformers import DataCollatorWithPadding

# Load dataset
dataset = load_dataset("squad")

# Load tokenizer & model
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")

# Function to preprocess data
def preprocess_function(examples):
    inputs = [f"Summarize: {context}" for context in examples["context"]]
    questions = examples["question"]  

    # Tokenize input & labels
    model_inputs = tokenizer(inputs, max_length=512, truncation=True, padding="max_length")
    labels = tokenizer(questions, max_length=128, truncation=True, padding="max_length")

    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

# Apply preprocessing & remove unnecessary columns
dataset = dataset.map(preprocess_function, batched=True, remove_columns=["id", "title", "answers", "context", "question"])

# Split dataset
dataset = dataset["train"].train_test_split(test_size=0.1)
train_dataset = dataset["train"]
eval_dataset = dataset["test"]

# Data collator
data_collator = DataCollatorWithPadding(tokenizer=tokenizer, return_tensors="pt")

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=10,
    remove_unused_columns=False
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    data_collator=data_collator
)

# Train model
trainer.train()
