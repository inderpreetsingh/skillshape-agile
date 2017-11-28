import React from "react";

export default classTypeSettings = {
    mainPanelHeader: {
        leftIcon: "assignment",
        title: "Class Types",
        actions: {
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
              { key: "gender", 
              	label: "Gender", 
              	type: "select", 
              	required: true,
              	defaultOption: "Gender",
              	options: [
              		{ label: "Male", value: "Male"},
              		{ label: "Female", value: "Female"},
              	]
              },
              { key: "ageMin", label: "Age Min", type: "number", required: true },
              { key: "ageMax", label: "Age Max", type: "number", required: true },
              { key: "experienceLevel", 
              	label: "Experience Level", 
              	type: "select", 
              	required: true,
              	defaultOption: "Experience Level",
              	options: [
              		{ label: "beginner", value: "beginner"},
              		{ label: "intermediate", value: "intermediate"},
              		{ label: "advanced", value: "advanced"},
              		{ label: "beginner plus intermediate", value: "beginner plus intermediate"},
              		{ label: "intermediate plus advanced", value: "intermediate plus advanced"},
              		{ label: "all", value: "all"},
              	]
              },
            ]
        }
    },
    mainTable: {
        title: "Location",
        tableFields: [
            { key: "name", label: "Class Type" },
            { key: "desc", label: "Class Type Description" },
            { key: "gender", label: "Gender" },
            { key: "ageMin", label: "Age Min" },
            { key: "ageMax", label: "Age Max"},
            { key: "experienceLevel", label: "Experience Level"},
        ],
        actions: {
            label: "Actions",
            toggleChildTable: true,
            edit: {
                title: "Edit Location",
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
                    { key: "gender", 
			              	label: "Gender", 
			              	type: "select", 
			              	required: true,
			              	defaultOption: "Gender",
			              	options: [
			              		{ label: "Male", value: "Male"},
			              		{ label: "Female", value: "Female"},
			              	]
			              },
                    { key: "ageMin", label: "Age Min", type: "number", required: true },
              			{ key: "ageMax", label: "Age Max", type: "number", required: true },
              			{ key: "experienceLevel", 
			              	label: "Experience Level", 
			              	type: "select", 
			              	required: true,
			              	defaultOption: "Experience Level",
			              	options: [
			              		{ label: "beginner", value: "beginner"},
			              		{ label: "intermediate", value: "intermediate"},
			              		{ label: "advanced", value: "advanced"},
			              		{ label: "beginner plus intermediate", value: "beginner plus intermediate"},
			              		{ label: "intermediate plus advanced", value: "intermediate plus advanced"},
			              		{ label: "all", value: "all"},
			              	]
			              },
                ]
            },
            delete: "removeClassType",
        }
    }
}