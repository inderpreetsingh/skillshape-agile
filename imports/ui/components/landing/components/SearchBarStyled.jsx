import React, {Fragment} from 'react';
import Sticky from 'react-stickynode';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SearchBar from 'material-ui-search-bar';
import PrimaryButton from './buttons/PrimaryButton';

import * as helpers from './jss/helpers.js';

const SearchBarWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
`;

const FilterButtonWrapper = styled.div`
  width: 100px;
`;

const SearchBarStyled = (props) => {
  // console.log("SearchBarStyled-->>",props)
  return (
      <SearchBarWrapper>
        <SearchBar
          style={{
            root: {
              fontFamily: helpers.specialFont,
              fontSize: helpers.baseFontSize*2+'px',
              margin: '0 auto',
            },
            input: {
              padding: '7px 0 14px'
            }
          }}
        onChange={props.onSearch}
        onRequestSearch={props.onSearch}
        itemScope
        itemType="http://schema.org/SearchAction"
        className = 'is-search-bar'
        hintText ='Yoga in Delhi...'
        />
        <FilterButtonWrapper>
          <PrimaryButton label="Filters" icon iconName="tune" increaseHeight noMarginBottom onClick={props.onFiltersButtonClick} />
        </FilterButtonWrapper>
      </SearchBarWrapper>
  )
}

SearchBarStyled.propTypes = {
  onFiltersButtonClick: PropTypes.func,
  onSearch: PropTypes.onSearch
}

export default SearchBarStyled;
