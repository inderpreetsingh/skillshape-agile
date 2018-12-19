import styled from 'styled-components';

import { Heading } from '/imports/ui/components/landing/components/jss/helpers.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

export const dialogStyles = {
  dialogTitleRoot: {
    padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv *
      3}px 0 ${helpers.rhythmDiv * 3}px`,
    marginBottom: `${helpers.rhythmDiv * 2}px`,
    "@media screen and (max-width : 500px)": {
      padding: `0 ${helpers.rhythmDiv * 3}px`
    }
  },
  dialogContent: {
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    paddingBottom: helpers.rhythmDiv * 2,
    flexGrow: 0,
    display: "flex",
    justifyContent: "center",
    minHeight: 200,
  },
  dialogRoot: {
    width: "100%",
    maxWidth: 400,
    [`@media screen and (max-width : ${helpers.mobile}px)`]: {
      margin: helpers.rhythmDiv
    }
  },
  iconButton: {
    height: "auto",
    width: "auto"
  }
};

