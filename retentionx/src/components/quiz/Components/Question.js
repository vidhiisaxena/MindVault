import React, { Component } from "react";
import Options from "./Option";

class Question extends Component {
    render() {
        const { question, selectedOption, onOptionChange, onSubmit } = this.props;

        return (
            <div className="question-container">
                <h3>Question</h3>
                <h5 className="mt-2">{question.question}</h5>
                <form onSubmit={onSubmit} className="mt-2 mb-2">
                    <Options
                        options={question.options}
                        selectedOption={selectedOption}
                        onOptionChange={onOptionChange}
                    />
                    <button type="submit" className="btn btn-primary mt-2">
                        NEXT
                    </button>
                </form>
            </div>
        );
    }
}

export default Question;
