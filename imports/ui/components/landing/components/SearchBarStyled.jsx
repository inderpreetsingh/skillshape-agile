import SearchBar from 'material-ui-search-bar';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PrimaryButton from './buttons/PrimaryButton';
import * as helpers from './jss/helpers';

const SearchBarWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
`;

const FilterButtonWrapper = styled.div`
  width: 100px;
`;

const SearchBarStyled = props =>
  // console.log("SearchBarStyled-->>",props)
  (
    <SearchBarWrapper>
      <SearchBar
        style={{
          root: {
            fontFamily: helpers.specialFont,
            fontSize: `${helpers.baseFontSize * 2}px`,
            margin: '0 auto',
          },
          input: {
            padding: '7px 0 14px',
          },
        }}
        onChange={props.onSearch}
        onRequestSearch={props.onSearch}
        itemScope
        itemType="http://schema.org/SearchAction"
        className="is-search-bar"
        hintText="Yoga in Delhi..."
      />
      <FilterButtonWrapper>
        <PrimaryButton
          label="Filters"
          icon
          iconName="tune"
          increaseHeight
          boxShadow
          noMarginBottom
          onClick={props.onFiltersButtonClick}
        />
      </FilterButtonWrapper>
    </SearchBarWrapper>
  );
SearchBarStyled.propTypes = {
  onFiltersButtonClick: PropTypes.func,
  onSearch: PropTypes.onSearch,
};

export default SearchBarStyled;
