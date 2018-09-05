import React from "react";
import ClassTypeForm from './classTypeForm';
import ClassTimeForm from './classTimeForm';
import ClassTypeDetails from './index';

export default classTypeSettings = {
    mainPanelHeader: {
        leftIcon: "assignment",
        title: "Class Types",
        titleKey: ["name"],
        showImageUpload: true,
        actions: {
            component: ClassTypeForm,
            buttonTitle: "ADD CLASS TYPE",
            title: "Class Type",
        },
        notes:'Class Types are a group of one or more Class Times where similar or related material is taught to students, possibly grouped by age, skill level, or gender. If you separate classes by age, gender, skill level or material, separate Class Types should be created.',
        expansionPanelRightBtnTitle: "Update Student",
    },
    mainTable: {
        title: "Class Type",
        tableFields: [
            { key: "name", label: "Class Type" },
            { key: "desc", label: "Class Type Description" },
            // { key: "selectedSkillCategory", label: "Skill Category", chipInput: true, childKey:"name"},
            { key: "selectedSkillSubject", label: "Skill Subject", chipInput: true, childKey:"name"},
            { key: "gender", label: "Gender", "labelSm": 4, "lableMd": 3, "valueSm": 4, "valueMd": 2 },
            { key: "ageMin", label: "Age", "labelSm": 4, "lableMd": 1, "valueSm": 4, "valueMd": 2},
            { key: "ageMax", label: "To", "labelSm": 4, "lableMd": 1, "valueSm": 4, "valueMd": 2},
            { key: "experienceLevel", label: "Experience Level", "labelSm": 4, "lableMd": 3, "valueSm": 4, "valueMd": 3  },
        ],
        actions: {
            edit: {
                component: ClassTypeForm,
                title: "Edit Class Type",
            }
        }
    },
    childPanelHeader: {
        leftIcon: "business",
        // title: "ClassTimes",
        havingImage: false,
        title: "ClassTimes with this ClassType",
        notes: "Upcoming classes within this class type",
        actions: {
            component: ClassTimeForm,
            buttonTitle: "Add ClassTime",
            title: "ClassTime",
        }
    },
    childTable: {
        title: "Class Times",
        tableFields: [
            { key: "name", label: "Name" },
            { key: "desc", label: "Class Time Description" },
            { key: "scheduleType", label: "Schedule Type", "labelSm": 3, "lableMd": 3, "valueSm": 4, "valueMd": 4  },
            { key: "scheduleDetails", label: "", nestedObjectOfArray: true,"labelSm": 0, "lableMd": 0, "valueSm": 12, "valueMd": 12},
        ],
        actions: {
            havingImage: false,
            edit: {
                component: ClassTimeForm,
                title: "Edit ClassTime",
            },
        }
    }
}
