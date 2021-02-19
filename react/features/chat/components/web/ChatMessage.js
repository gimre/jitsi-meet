// @flow

import React from 'react';
import { toArray } from 'react-emoji-render';


import { translate } from '../../../base/i18n';
import { Linkify } from '../../../base/react';
import { MESSAGE_TYPE_LOCAL } from '../../constants';
import AbstractChatMessage, {
    type Props
} from '../AbstractChatMessage';
import PrivateMessageButton from '../PrivateMessageButton';

/**
 * Renders a single chat message.
 */
class ChatMessage extends AbstractChatMessage<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { message } = this.props;
        const processedMessage = [];

        // content is an array of text and emoji components
        const content = toArray(this._getMessageText(), { className: 'smiley' });

        content.forEach(i => {
            if (typeof i === 'string') {
                processedMessage.push(<Linkify key = { i }>{ i }</Linkify>);
            } else {
                processedMessage.push(i);
            }
        });

        const chatMessageClassName = message.privateMessage
            ? 'privatemessage'
            : message.systemMessage
                ? 'systemmessage'
                : '';

        return (
            <div className = 'chatmessage-wrapper'>
                <div className = { `chatmessage ${chatMessageClassName}` }>
                    <div className = 'replywrapper'>
                        <div className = 'messagecontent'>
                            { this.props.showDisplayName && this._renderDisplayName() }
                            { message.systemMessage
                                ? this._renderSystemMessage()
                                : (
                                    <>
                                        <div className = 'usermessage'>
                                            { processedMessage }
                                        </div>
                                        { message.privateMessage && this._renderPrivateNotice() }
                                    </>
                                )
                            }

                        </div>
                        { message.privateMessage && message.messageType !== MESSAGE_TYPE_LOCAL
                            && (
                                <div className = 'messageactions'>
                                    <PrivateMessageButton
                                        participantID = { message.id }
                                        reply = { true }
                                        showLabel = { false } />
                                </div>
                            ) }
                    </div>
                </div>
                { this.props.showTimestamp && this._renderTimestamp() }
            </div>
        );
    }

    _getFormattedTimestamp: () => string;

    _getMessageText: () => string;

    _getPrivateNoticeMessage: () => string;

    /**
     * Renders the display name of the sender.
     *
     * @returns {React$Element<*>}
     */
    _renderDisplayName() {
        return (
            <div className = 'display-name'>
                { this.props.message.displayName }
            </div>
        );
    }

    /**
     * Renders the message privacy notice.
     *
     * @returns {React$Element<*>}
     */
    _renderPrivateNotice() {
        return (
            <div className = 'privatemessagenotice'>
                { this._getPrivateNoticeMessage() }
            </div>
        );
    }

    _renderSystemMessage() {
        const data = JSON.parse(this._getMessageText())

        switch (this.props.message.systemMessage) {
            case 'end-poll': {
                const {
                    participants,
                    poll,
                    votes_for
                } = data;
                const yesPercent = votes_for / participants * 100;
                return (
                    <>
                        <div class="hideable">Poll:&nbsp;<b>{ poll }</b></div>
                        <div class="systemmessagepoll">
                            <div class="piechart"
                                style={{
                                    background: `conic-gradient(
                                        #4e79a7 0,
                                        #4e79a7 ${yesPercent}%,
                                        #e15759 0,
                                        #e15759 100%
                                    )`
                                }}
                            />
                            <div class="breakdown">
                                <div class="yes">Raised hand ({votes_for})</div>
                            <div class="no">No action ({participants - votes_for})</div>
                            </div>
                        </div>
                    </>
                )
                break;
            }
            case 'start-poll': {
                const { poll } = data
                return (
                    <div class="systemmessagestartpoll">
                        Poll:&nbsp;<b>{ poll }</b>
                    </div>
                )
            }
            default:
                return this._getMessageText();
        }
    }

    /**
     * Renders the time at which the message was sent.
     *
     * @returns {React$Element<*>}
     */
    _renderTimestamp() {
        return (
            <div className = 'timestamp'>
                { this._getFormattedTimestamp() }
            </div>
        );
    }
}

export default translate(ChatMessage);
