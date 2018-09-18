import React, { Component } from "react";
import SuggestionForm from "./SuggestionForm.jsx";

// This class just gonna check if the props being passed to the form
// are same we not gonna update the form.
// NOTE: It's like a temporary solution to SuggestionForm re rendering..
class SuggestionFormWrapper extends Component {
  _areSkillCategoriesSame = (
    currentSkillCategories,
    nextPropsSkillCategories
  ) => {
    if (!currentSkillCategories.length || nextPropsSkillCategories.length) {
      return false;
    } else if (currentSkillCategories.length !== nextPropsSkillCategories) {
      return false;
    }

    const totalLength = currentSkillCategories.length;
    for (let i = 0; i < totalLength; ++i) {
      if (
        currentSkillCategories[i]._id !== nextPropsSkillCategories[i]._id ||
        nextPropsSkillCategories[i].name !== nextPropsSkillCategories[i].name
      ) {
        return false;
      }
    }

    return true;
  };

  shouldComponentUpdate(nextProps, nextState) {
    const nextFilters = nextProps.filters;
    const currentFilters = this.props.filters;

    console.group("SUGGESTION FORM FILTERS");
    console.log(nextFilters, currentFilters);
    console.groupEnd();

    if (
      currentFilters.locationName !== nextFilters.locationName ||
      currentFilters.schoolName !== nextFilters.schoolName ||
      !this._areSkillCategoriesSame(currentFilters, nextFilters)
    ) {
      return false;
    }

    return true;
  }
  render() {
    const {
      filters,
      tempFilters,
      onSearchAgainButtonClick,
      removeAllFilters
    } = this.props;
    return (
      <SuggestionForm
        onSearchAgainButtonClick={onSearchAgainButtonClick}
        filters={filters}
        tempFilters={tempFilters}
        removeAllFilters={removeAllFilters}
      />
    );
  }
}

export default SuggestionFormWrapper;
