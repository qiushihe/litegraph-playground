import React, { useState, useCallback, useEffect } from "react";
import PropTypes, { InferProps, Requireable } from "prop-types";
import noop from "lodash/fp/noop";

import {
  Base,
  MultiLineField,
  SingleLineField,
  PropertyViewer,
  PropertyTitle,
  PropertyValue,
  EditorForm,
  EditorMeta,
  EditorFormType,
  EditorFormMultiLine,
  EditorFormField,
  EditorFormButtons,
  SaveButton,
  CancelButton
} from "./editor-property-field.style";

const PROP_TYPES = {
  className: PropTypes.string,
  isEditable: PropTypes.bool,
  isMultiLine: PropTypes.bool,
  editorType: PropTypes.oneOf(["json"]),
  propertyName: PropTypes.string,
  getPropertyValue: PropTypes.func as Requireable<() => string>,
  onChange: PropTypes.func as Requireable<(value: string) => void>
};

const DEFAULT_PROPS = {
  className: "",
  isEditable: false,
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
  const isEditable = props.isEditable || DEFAULT_PROPS.isEditable;
  const isMultiLine = props.isMultiLine || DEFAULT_PROPS.isMultiLine;
  const editorType = props.editorType || DEFAULT_PROPS.editorType;
  const propertyName = props.propertyName || DEFAULT_PROPS.propertyName;
  const getPropertyValue =
    props.getPropertyValue || DEFAULT_PROPS.getPropertyValue;
  const onChange = props.onChange || DEFAULT_PROPS.onChange;

  const [isEditing, setIsEditing] = useState(false);
  const [isCurrentlyMultiLine, setIsCurrentlyMultiLine] = useState(isMultiLine);
  const [fieldValue, setFieldValue] = useState(getPropertyValue());

  const handleToggleMultiLine = useCallback(() => {
    setIsCurrentlyMultiLine(!isCurrentlyMultiLine);
  }, [isCurrentlyMultiLine]);

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

  const handleEditFieldValue = useCallback(() => {
    if (!isEditing) {
      setIsEditing(true);
    }
  }, [isEditing]);

  useEffect(() => {
    setFieldValue(getPropertyValue());
  }, [getPropertyValue]);

  return (
    <Base className={className}>
      {isEditing ? (
        <EditorForm onSubmit={handleFormSubmit}>
          <PropertyTitle>{propertyName}</PropertyTitle>
          <EditorMeta>
            <EditorFormType>type: {editorType}</EditorFormType>
            <EditorFormMultiLine>
              <input
                type="checkbox"
                checked={isCurrentlyMultiLine}
                onChange={handleToggleMultiLine}
              />
              MultiLine
            </EditorFormMultiLine>
          </EditorMeta>
          <EditorFormField>
            {isCurrentlyMultiLine ? (
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
        <PropertyViewer onClick={isEditable ? handleEditFieldValue : noop}>
          <PropertyTitle>{propertyName}</PropertyTitle>
          <PropertyValue>{getPropertyValue()}</PropertyValue>
        </PropertyViewer>
      )}
    </Base>
  );
};

EditorPropertyField.propTypes = PROP_TYPES;
EditorPropertyField.defaultProps = DEFAULT_PROPS;

export default EditorPropertyField;
