import React from "react";
import ClassTypeForm from './classTypeForm';
import ClassTimeForm from './classTimeForm';

export default classTypeSettings = {
    mainPanelHeader: {
        leftIcon: "assignment",
        title: "Class Types",
        titleKey: "name",
        showImageUpload: true,
        actions: {
            component: ClassTypeForm,
            buttonTitle: "ADD CLASS TYPE",
            onSubmit: "addClassType",
            title: "Class Type",
            formFields: [
                { key: "classTypeImg", label: "", type: "image", required: false },
                { key: "name", label: "Class Type", type: "text", required: true },
                { key: "desc", label: "Class Type Description", type: "textArea", required: true },
                {
                    key: "skillCategoryId",
                    label: "Skill Category",
                    type: "autoComplete",
                    required: true,
                    method: "getSkillCategory",
                    suggestion: "name",
                    valueField: "_id",
                    child: {
                        key: "skillSubject",
                        label: "Skill Subject",
                        type: "auto-select",
                        required: true,
                        multi: true,
                        method: "getSkillSubjectBySkillCategory",
                        suggestion: "name",
                        suggestionData: null,
                        valueField: "_id"
                    }
                },
                {
                    key: "gender",
                    label: "Gender",
                    type: "select",
                    required: true,
                    defaultOption: "Gender",
                    options: [
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                    ]
                },
                { key: "ageMin", label: "Age Min", type: "number", required: true },
                { key: "ageMax", label: "Age Max", type: "number", required: true },
                {
                    key: "experienceLevel",
                    label: "Experience Level",
                    type: "select",
                    required: true,
                    defaultOption: "Experience Level",
                    options: [
                        { label: "beginner", value: "beginner" },
                        { label: "intermediate", value: "intermediate" },
                        { label: "advanced", value: "advanced" },
                        { label: "beginner plus intermediate", value: "beginner plus intermediate" },
                        { label: "intermediate plus advanced", value: "intermediate plus advanced" },
                        { label: "all", value: "all" },
                    ]
                },
            ]
        }
    },
    mainTable: {
        title: "Class Type",
        tableFields: [
            { key: "name", label: "Class Type" },
            { key: "desc", label: "Class Type Description" },
            { key: "selectedSkillCategory", label: "Skill Category", chipInput: true, childKey:"name"},
            { key: "selectedSkillSubject", label: "Skill Subject", chipInput: true, childKey:"name"},
            { key: "gender", label: "Gender", "labelSm": 4, "lableMd": 3, "valueSm": 4, "valueMd": 2 },
            { key: "ageMin", label: "Age", "labelSm": 4, "lableMd": 1, "valueSm": 4, "valueMd": 2},
            { key: "ageMax", label: "To", "labelSm": 4, "lableMd": 1, "valueSm": 4, "valueMd": 2},
            { key: "experienceLevel", label: "Experience Level", "labelSm": 4, "lableMd": 3, "valueSm": 4, "valueMd": 3  },
            { key: "selectedLocation", label: "Location", childKeys: ["address", "city", "country"], "labelSm": 4, "lableMd": 1, "valueSm": 4, "valueMd": 5 },
        ],
        actions: {
            label: "Actions",
            toggleChildTable: true,
            edit: {
                component: ClassTypeForm,
                title: "Edit Class Type",
                onSubmit: "updateClassType",
                editByField: "_id",
                formFields: [
                    { key: "classTypeImg", label: "", type: "image", required: false },
                    { key: "name", label: "Class Type", type: "text", required: false },
                    { key: "desc", label: "Class Type Description", type: "textArea", required: true },
                    {
                        key: "skillCategoryId",
                        objKey: "skillCategory",
                        label: "Skill Category",
                        type: "autoComplete",
                        required: true,
                        method: "getSkillCategory",
                        suggestion: "name",
                        valueField: "_id",
                        child: {
                            key: "skillSubject",
                            label: "Skill Subject",
                            type: "auto-select",
                            required: true,
                            multi: true,
                            method: "getSkillSubjectBySkillCategory",
                            suggestion: "name",
                            suggestionData: null,
                            valueField: "_id"
                        }
                    },
                    {
                        key: "gender",
                        label: "Gender",
                        type: "select",
                        required: true,
                        defaultOption: "Gender",
                        options: [
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                        ]
                    },
                    { key: "ageMin", label: "Age Min", type: "number", required: true },
                    { key: "ageMax", label: "Age Max", type: "number", required: true },
                    {
                        key: "experienceLevel",
                        label: "Experience Level",
                        type: "select",
                        required: true,
                        defaultOption: "Experience Level",
                        options: [
                            { label: "beginner", value: "beginner" },
                            { label: "intermediate", value: "intermediate" },
                            { label: "advanced", value: "advanced" },
                            { label: "beginner plus intermediate", value: "beginner plus intermediate" },
                            { label: "intermediate plus advanced", value: "intermediate plus advanced" },
                            { label: "all", value: "all" },
                        ]
                    },
                ]
            },
            delete: "removeClassType",
        }
    },
    childPanelHeader: {
        leftIcon: "business",
        title: "ClassTimes",
        havingImage: false,
        notes: "ClassTimes with this ClassType",
        actions: {
            component: ClassTimeForm,
            parentKey: "_id",
            buttonTitle: "Add ClassTime",
            onSubmit: "addClassTime",
            title: "ClassTime",
            formFields: [
                { key: "name", label: "Name", type: "text", required: true },
                { key: "desc", label: "Class Time Description", type: "text", required: true },
                { key: "scheduleType", label: "Schedule Type", type: "text", required: true },
            ]
        }
    },
    childTable: {
        title: "Class Times",
        tableFields: [
            { key: "name", label: "Name" },
            { key: "desc", label: "Class Time Description" },
            { key: "scheduleType", label: "Schedule Type", "labelSm": 3, "lableMd": 3, "valueSm": 4, "valueMd": 4  },
        ],
        actions: {
            parentKey: "_id",
            label: "Actions",
            havingImage: false,
            toggleChildTable: false,
            edit: {
                component: ClassTimeForm,
                onSubmit: "editClassTime",
                title: "Edit ClassTime",
                editByField: "id",
                formFields: [
                    { key: "name", label: "Name", type: "text", required: true },
                    { key: "desc", label: "Class Time Description", type: "text", required: true },
                    { key: "scheduleType", label: "Schedule Type", type: "text", required: true },
                ]
            },
            delete: "removeClassTime",
        }
    }
}