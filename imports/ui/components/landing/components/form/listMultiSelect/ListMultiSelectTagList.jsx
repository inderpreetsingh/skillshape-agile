import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import MultiselectTag from 'react-widgets/lib/MultiselectTag';
import { dataIndexOf } from 'react-widgets/lib/util/dataHelpers';
import * as CustomPropTypes from 'react-widgets/lib/util/PropTypes';
import styled from 'styled-components';
import * as helpers from '../../jss/helpers';

// disabled === true || [1, 2, 3, etc]
const isDisabled = (item, list, value) => !!(Array.isArray(list) ? ~dataIndexOf(list, item, value) : list);

const FilterButtonWrapper = styled.div`
  display: flex;
`;

const FilterButtonDesktopView = styled.div`
  display: flex;
`;

class ListMultiSelectList extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    activeId: PropTypes.string.isRequired,
    label: PropTypes.string,

    value: PropTypes.array,
    focusedItem: PropTypes.any,

    valueAccessor: PropTypes.func.isRequired,
    textAccessor: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    ValueComponent: PropTypes.func,
    disabled: CustomPropTypes.disabled.acceptsArray,
  };

  state = {
    collapsedList: false,
  };

  _getInputWidth = () => {
    if (window.innerWidth < helpers.mobile) {
      return 80;
    }

    return 120;
  };

  handleDelete = (item, event) => {
    // console.log('handling delete,',item);
    if (this.props.disabled !== true) this.props.onDelete(item, event);
  };

  handleNoOfFiltersClick = (e) => {
    e.preventDefault();
    if (this.props.onNoOfFiltersClick) this.props.onNoOfFiltersClick();
  };

  renderListItemWithButton = () => {
    const {
      value,
      valueAccessor,
      ValueComponent,
      textAccessor,
      disabled,
      focusedItem,
      activeId,
    } = this.props;

    const noOfFilters = value.length - 1;

    const item = value[value.length - 1];
    const isFocused = focusedItem === item;
    return (
      <Fragment>
        <MultiselectTag
          key={1}
          id={isFocused ? activeId : null}
          value={item}
          focused={isFocused}
          onClick={this.handleDelete}
          disabled={isDisabled(item, disabled, valueAccessor)}
        >
          {ValueComponent ? <ValueComponent item={item} /> : <span>{textAccessor(item)}</span>}
        </MultiselectTag>
        {value.length > 1 && (
          <FilterButtonWrapper>
            {/* <FilterButtonTabletView>
          <button className="no-shrink primary-button my-multi-select-filter-btn" onClick={this.handleNoOfFiltersClick}>{`+${noOfFilters}`}</button>
        </FilterButtonTabletView> */}

            <FilterButtonDesktopView>
              <button
                className="no-shrink primary-button my-multi-select-filter-btn"
                onClick={this.handleNoOfFiltersClick}
              >
                {`+${noOfFilters}`}
              </button>
            </FilterButtonDesktopView>
          </FilterButtonWrapper>
        )}
      </Fragment>
    );
  };

  renderCustomList() {
    const {
      value,
      valueAccessor,
      ValueComponent,
      textAccessor,
      disabled,
      focusedItem,
    } = this.props;

    return value.map((item, i) => {
      const isFocused = focusedItem === item;

      return (
        <MultiselectTag
          key={i}
          id={isFocused ? activeId : null}
          value={item}
          focused={isFocused}
          onClick={this.handleDelete}
          disabled={isDisabled(item, disabled, valueAccessor)}
        >
          {ValueComponent ? <ValueComponent item={item} /> : <span>{textAccessor(item)}</span>}
        </MultiselectTag>
      );
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { containerWidth } = this.props;
    const listWidth = this.multiselectList.getBoundingClientRect().width;
    const inputWrapperWidth = this._getInputWidth();
    // console.group("ListMultiSelectList Update");
    // console.info(containerWidth, - 80, listWidth);
    // console.groupEnd();

    if (containerWidth - inputWrapperWidth < listWidth) {
      if (!this.state.collapsedList) {
        this.setState(state => ({
          ...state,
          collapsedList: true,
        }));
        this.props.onListCollapse(true);
      }
    } else if (this.state.collapsedList) {
      this.setState(state => ({
        ...state,
        collapsedList: false,
      }));
      this.props.onListCollapse(false);
    }
    // console.groupEnd();
  }

  render() {
    const { id, label } = this.props;

    return (
      <Fragment>
        <ul
          id={id}
          tabIndex="-1"
          role="listbox"
          aria-label={label}
          className="rw-my-multiselect-taglist"
        >
          {this.state.collapsedList ? this.renderListItemWithButton() : this.renderCustomList()}
        </ul>
        <FakeList>
          <ul
            ref={(multiselectList) => {
              this.multiselectList = multiselectList;
              ourMultiSelect = multiselectList;
            }}
            id={id}
            tabIndex="-1"
            role="listbox"
            aria-label={label}
            className="rw-my-multiselect-taglist"
          >
            {this.renderCustomList()}
          </ul>
        </FakeList>
      </Fragment>
    );
  }
}

const FakeList = styled.div`
  position: absolute;
  opacity: 0;
  height: 0;
  top: -100vh;
  z-index: -1000;
`;

export default ListMultiSelectList;
