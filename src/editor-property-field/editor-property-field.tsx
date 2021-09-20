import React, { useState, useCallback, useEffect } from "react";
import PropTypes, { InferProps, Requireable } from "prop-types";

import {
  Base,
  MultiLineField,
  SingleLineField,
  PropertyViewer,
  PropertyTitle,
  PropertyValue,
  EditorForm,
  EditorFormType,
  EditorFormField,
  EditorFormButtons,
  SaveButton,
  CancelButton
} from "./editor-property-field.style";

const PROP_TYPES = {
  className: PropTypes.string,
  isMultiLine: PropTypes.bool,
  editorType: PropTypes.oneOf(["json"]),
  propertyName: PropTypes.string,
  getPropertyValue: PropTypes.func as Requireable<() => string>,
  onChange: PropTypes.func as Requireable<(value: string) => void>
};

const DEFAULT_PROPS = {
  className: "",
  isMultiLine: false,
  editorType: "json",
  propertyName: "Property",
  propertyValue: "",
  getPropertyValue: (() => {}) as () => string,
  onChange: (() => {}) as (value: string) => void
};

const EditorPropertyField: React.FunctionComponent<
  InferProps<typeof PROP_TYPES>
> = (props) => {
  const className = props.className || DEFAULT_PROPS.className;
  const isMultiLine = props.isMultiLine || DEFAULT_PROPS.isMultiLine;
  const editorType = props.editorType || DEFAULT_PROPS.editorType;
  const propertyName = props.propertyName || DEFAULT_PROPS.propertyName;
  const getPropertyValue =
    props.getPropertyValue || DEFAULT_PROPS.getPropertyValue;
  const onChange = props.onChange || DEFAULT_PROPS.onChange;

  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(getPropertyValue());

  const handleFieldChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFieldValue(evt.target.value);
    },
    []
  );

  const handleFormCancel = useCallback(() => {
    setFieldValue(getPropertyValue());
    setIsEditing(false);
  }, [getPropertyValue]);

  const handleFormSubmit = useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      const { propertyValue: submittedPropertyValue } = Object.fromEntries(
        new FormData(evt.target as HTMLFormElement)
      ) as { propertyValue: string };

      setFieldValue(submittedPropertyValue);
      setIsEditing(false);

      onChange(submittedPropertyValue);
    },
    [onChange]
  );

  useEffect(() => {
    setFieldValue(getPropertyValue());
  }, [getPropertyValue]);

  return (
    <Base className={className}>
      {isEditing ? (
        <EditorForm onSubmit={handleFormSubmit}>
          <PropertyTitle>{propertyName}</PropertyTitle>
          <EditorFormType>type: {editorType}</EditorFormType>
          <EditorFormField>
            {isMultiLine ? (
              <MultiLineField
                name="propertyValue"
                value={fieldValue}
                onChange={handleFieldChange}
              />
            ) : (
              <SingleLineField
                name="propertyValue"
                value={fieldValue}
                onChange={handleFieldChange}
              />
            )}
          </EditorFormField>
          <EditorFormButtons>
            <SaveButton />
            <CancelButton onClick={handleFormCancel} />
          </EditorFormButtons>
        </EditorForm>
      ) : (
        <PropertyViewer onClick={() => setIsEditing(true)}>
          <PropertyTitle>{propertyName}</PropertyTitle>
          <PropertyValue>{getPropertyValue()}</PropertyValue>
        </PropertyViewer>
      )}
    </Base>
  );
};

export default EditorPropertyField;
