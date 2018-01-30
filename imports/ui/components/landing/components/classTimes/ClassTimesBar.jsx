import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CSSTransitionGroup } from 'react-transition-group';

import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

import ClassTime from './ClassTime.jsx';

import classTime from '../../constants/structure/classTime.js';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  width: 100%;
`;

const ClassTimesWrapper = styled.div`
  padding: ${helpers.rhythmDiv * 3}px;
`;

const TransitionHandler = styled.div`
  transition: all .8s linear;
`;

function FadeAndSlideTransition ({children, duration, in: inProp}) {
  // Styles to set on children which are necessary in order
  // for the animation to work.
  const defaultStyle = {
    // Transition "opacity" and "transform" CSS properties.
    // Set duration of the transition to the duration of the animation.
    transition: `${duration}ms ease-in`,
    transitionProperty: 'opacity, transform'
  }

  // Styles that will be applied to children as the status
  // of the transition changes. Each key of the
  // 'transitionStyles' object matches the name of a
  // 'status' provided by <Transition />.
  const transitionStyles = {
    // Start with component invisible and shifted up by 10%
    entering: {
      opacity: 0,
      transform: 'translateY(-10%)'
    },
    // Transition to component being visible and having its position reset.
    entered: {
      opacity: 1,
      transform: 'translateY(0)'
    },
    // Fade element out and slide it back up on exit.
    exiting: {
      opacity: 0,
      transform: 'translateY(-10%)'
    }
  }

  // Wrap child node in <Transition />.
  return (
    <TransitionGroup in={inProp} timeout={{
      // Set 'enter' timeout to '0' so that enter animation
      // will start immediately.
      enter: 0,

      // Set 'exit' timeout to 'duration' so that the 'exited'
      // status won't be applied until animation completes.
      exit: duration
    }}>
      {
        // Children is a function that receives the current
        // status of the animation.
        (status) => {
          // Don't render anything if component has 'exited'.
          if (status === 'exited') {
            return null
          }

          // Apply different styles to children based
          // on the current value of 'status'.
          const currentStyles = transitionStyles[status]
          return React.cloneElement(children, {
            style: Object.assign({}, defaultStyle, currentStyles)
          })
        }
      }
    </TransitionGroup>
  )
}

const ClassTimesBar = (props) => (
  <Wrapper>
     <ClassTimesWrapper>
      <Grid container spacing={24}>
        {props.classTimesData.map(classTimeObj => (
          <CSSTransitionGroup
            transitionName="fade-anim"
            transitionAppear={true}
            transitionAppearTimeout={900}
            transitionEnterTimeout={900}
            transitionLeaveTimeout={900}
            in
            >
          <Grid key={classTimeObj._id} item xs={12} sm={6} md={4} lg={3}>
            <ClassTime {...classTimeObj} />
          </Grid>
          </CSSTransitionGroup>
        ))}
      </Grid>
     </ClassTimesWrapper>
  </Wrapper>
);

ClassTimesBar.propTypes = {
  classTimesData: PropTypes.arrayOf(classTime),

}

export default ClassTimesBar;
