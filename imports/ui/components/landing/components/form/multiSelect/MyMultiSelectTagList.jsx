import React,{Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import PrimaryButton from '../../buttons/PrimaryButton.jsx';

import MultiselectTag from 'react-widgets/lib/MultiselectTag';
import * as CustomPropTypes from 'react-widgets/lib/util/PropTypes';
import { dataIndexOf } from 'react-widgets/lib/util/dataHelpers';

import * as helpers from '../../jss/helpers.js';


// disabled === true || [1, 2, 3, etc]
const isDisabled = (item, list, value) =>
  !!(Array.isArray(list) ? ~dataIndexOf(list, item, value) : list)

const FilterButtonWrapper = styled.div`
  display: flex;

  @media screen and (max-width: ${helpers.mobile}px) {
    min-width: 100px;
  }
`;

class MyTagList extends React.Component {
  static propTypes ={
    id: PropTypes.string.isRequired,
    activeId: PropTypes.string.isRequired,
    label: PropTypes.string,

    value: PropTypes.array,
    focusedItem: PropTypes.any,

    valueAccessor: PropTypes.func.isRequired,
    textAccessor: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    valueComponent: PropTypes.func,
    disabled: CustomPropTypes.disabled.acceptsArray,
  };

  state = {
    mobile: false
  }

  handleDelete = (item, event) => {
    // console.log('handling delete,',item);
    if (this.props.disabled !== true)
      this.props.onDelete(item, event)
  };

  handleNoOfFiltersClick = (e) => {
    e.preventDefault();
    console.log('click..');
    if(this.props.onNoOfFiltersClick)
      this.props.onNoOfFiltersClick();
  }

  handleUpdateDimensions = (e) => {
    if(window.innerWidth < 500) {
      if(!this.state.mobile) this.setState({ mobile: true });
    }else {
      if(this.state.mobile) this.setState({ mobile: false })
    }
  }

  componentDidMount = () => {
    this.handleUpdateDimensions();
    window.addEventListener('resize',this.handleUpdateDimensions);
  }

  componentWillUnMount = () => {
    window.addEventListener('resize',this.handleUpdateDimensions);
  }

  renderCustomList() {
    const { value ,valueAccessor, ValueComponent, textAccessor, label, disabled, focusedItem} = this.props;

    const noOfFilters = value.length - 1;
    if(value.length > 1) {
      const item = value[value.length - 1];
      const isFocused = focusedItem === item;
      return (<Fragment>
      <MultiselectTag
        key={1}
        id={isFocused ? activeId : null }
        value={item}
        focused={isFocused}
        onClick={this.handleDelete}
        disabled={isDisabled(item, disabled, valueAccessor)}
      >
        {ValueComponent
          ? <ValueComponent item={item} />
          : <span>{textAccessor(item)}</span>
        }
      </MultiselectTag>
      <FilterButtonWrapper>
        {this.state.mobile ?
        <div>
          <button className="no-shrink primary-button" onClick={this.handleNoOfFiltersClick}>{`+ ${noOfFilters}`}</button>
        </div>
        :
        <button className="no-shrink primary-button" onClick={this.handleNoOfFiltersClick}>{`+ ${noOfFilters} Filters`}</button>}
      </FilterButtonWrapper>
    </Fragment>
    );
    }

    return value.map((item, i) => {
      let isFocused = focusedItem === item;

      return (<MultiselectTag
          key={i}
          id={isFocused ? activeId : null }
          value={item}
          focused={isFocused}
          onClick={this.handleDelete}
          disabled={isDisabled(item, disabled, valueAccessor)}
        >
          {ValueComponent
            ? <ValueComponent item={item} />
            : <span>{textAccessor(item)}</span>
          }
        </MultiselectTag>
      )
    })
  }

  render() {
    let {
        id
      , value
      , activeId
      , valueAccessor
      , textAccessor
      , label
      , disabled
      , focusedItem
      , valueComponent: ValueComponent }  = this.props;

    return (
      <ul
        id={id}
        tabIndex='-1'
        role='listbox'
        aria-label={label}
        className='rw-my-multiselect-taglist'
      >
        {this.renderCustomList()}
      </ul>
    )
  }
}

export default MyTagList
