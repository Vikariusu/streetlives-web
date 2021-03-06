import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../../../components/header';
import Button from '../../../components/button';
import Icon from '../../../components/icon';
import TextArea from '../../../components/textarea';
import Speech, { ListeningIndicator } from '../../../components/speech';
import withCommentsForm from '../withCommentsForm';

class CommentText extends Component {
  constructor() {
    super();
    this.onTextChange = this.onTextChange.bind(this);
  }

  onTextChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <Speech initialValue={this.props.value} onGotText={this.props.onChange}>
        {({
          isSpeechSupported,
          isListening,
          currentTranscript,
          startSpeechToText,
        }) => (
          <div>
            <div className="px-4 pb-5">
              <Header size="large" className="mb-3 text-left">
                Tell us what you think about {this.props.organizationName}
              </Header>
              <p>
                How was your experience?
                If you like, please add your first name or initials at the end.
                Please do not leave your full name
              </p>
              {isSpeechSupported && (
                <p>
                  Type below, or tap Mic to record your comment.
                </p>
              )}
            </div>
            {isListening && <ListeningIndicator className="mt-3" />}
            <div className="fixed-bottom p-2 border d-flex flex-row bg-light">
              <TextArea
                value={currentTranscript}
                onChange={this.onTextChange}
                autoFocus
                fluid
                rounded
                className={`flex-1 py-2 pl-2 pr-${isSpeechSupported ? '4' : '2'} border`}
              />
              <div className="align-self-end" style={{ position: 'relative' }}>
                {isSpeechSupported && !isListening && (
                  <Icon
                    onClick={startSpeechToText}
                    name="microphone"
                    className="border rounded-circle py-1 px-2 mb-2"
                    style={{
                      backgroundColor: '#F8E71C',
                      position: 'absolute',
                      right: '3px',
                      bottom: '0px',
                    }}
                  />
                )}
              </div>
              <Button
                onClick={this.props.onSubmit}
                disabled={!this.props.value}
                primary
                className="py-1 ml-1 mb-2 align-self-end"
              >
                ADD
              </Button>
            </div>
          </div>
        )}
      </Speech>
    );
  }
}

CommentText.propTypes = {
  organizationName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withCommentsForm(CommentText, { hideInfoLink: true });
