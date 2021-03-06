// @flow

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { openDialog } from '../../base/dialog';
import { isLocalParticipantModerator } from '../../base/participants';
import { MuteEveryoneDialog } from '../../video-menu/components/';
import { close } from '../actions';
import { classList, findStyledAncestor, getParticipantsPaneOpen } from '../functions';
import theme from '../theme.json';

import { FooterContextMenu } from './FooterContextMenu';
import { LobbyParticipantList } from './LobbyParticipantList';
import { MeetingParticipantList } from './MeetingParticipantList';
import {
    AntiCollapse,
    Close,
    Container,
    Footer,
    FooterButton,
    FooterEllipsisButton,
    FooterEllipsisContainer,
    Header
} from './styled';

export const ParticipantsPane = () => {
    const dispatch = useDispatch();
    const paneOpen = useSelector(getParticipantsPaneOpen);
    const isLocalModerator = useSelector(isLocalParticipantModerator);
    const [ contextOpen, setContextOpen ] = useState(false);
    const { t } = useTranslation();

    const closePane = useCallback(() => dispatch(close(), [ dispatch ]));
    const muteAll = useCallback(() => dispatch(openDialog(MuteEveryoneDialog)), [ dispatch ]);

    useEffect(() => {
        const handler = [ 'click', e => {
            if (!findStyledAncestor(e.target, FooterEllipsisContainer)) {
                setContextOpen(false);
            }
        } ];

        window.addEventListener(...handler);

        return () => window.removeEventListener(...handler);
    }, [ contextOpen ]);

    const toggleContext = useCallback(() => setContextOpen(!contextOpen), [ contextOpen, setContextOpen ]);

    return (
        <ThemeProvider theme = { theme }>
            <div
                className = { classList(
          'participants_pane',
          !paneOpen && 'participants_pane--closed'
                ) }>
                <div className = 'participants_pane-content'>
                    <Header>
                        <Close onClick = { closePane } />
                    </Header>
                    <Container>
                        <LobbyParticipantList />
                        <AntiCollapse />
                        <MeetingParticipantList />
                    </Container>
                    {isLocalModerator && (
                        <Footer>
                            <FooterButton onClick = { muteAll }>
                                {t('participantsPane.actions.muteAll')}
                            </FooterButton>
                            <FooterEllipsisContainer>
                                <FooterEllipsisButton onClick = { toggleContext } />
                                {contextOpen && <FooterContextMenu onMouseLeave = { toggleContext } />}
                            </FooterEllipsisContainer>
                        </Footer>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
};
