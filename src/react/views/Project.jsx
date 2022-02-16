import React from "react";
import PropTypes from "prop-types";

import * as sequelize4 from "../../templates/sequelize-4.js";
import NewModelForm from "./Project/NewModelForm.jsx";
import Checkbox from "../components/Checkbox.jsx";
import Button from "../components/Button.jsx";
import LegacyInfo from "../components/LegacyInfo.jsx";
import ToolBelt from "../components/ToolBelt.jsx";
import { CodeFlyout } from "../components/Code.jsx";
import * as List from "../components/List.jsx";

export default class Project extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    models: PropTypes.arrayOf(PropTypes.object.isRequired),
    toggleTimestamps: PropTypes.func.isRequired,
    toggleSnake: PropTypes.func.isRequired,
    toggleSingularTableNames: PropTypes.func.isRequired,
    createModel: PropTypes.func.isRequired,
    goToModel: PropTypes.func.isRequired,
    deleteModel: PropTypes.func.isRequired,
    newMessage: PropTypes.func.isRequired,
  };

  state = { creatingNewModel: false, codeOpen: false };

  constructor(props) {
    super(props);
    this.createRefs();
  }

  createRefs = () => {
    this.addButton = React.createRef();
    this.createViewModelRefs();
  };

  createViewModelRefs = () => {
    this.props.models.forEach((model) => this.createViewModelRef(model));
  };

  createViewModelRef = ({ id }) => {
    if (!this[`viewModelButton${id}`]) {
      this[`viewModelButton${id}`] = React.createRef();
    }
  };

  componentDidMount() {
    if (this.props.models.length === 0) this.focusOnAddButton();
  }

  componentDidUpdate(prevProps, prevState) {
    const modelAdded = prevProps.models.length < this.props.models.length;
    if (modelAdded) {
      this.createViewModelRefs();
      const addedModel = this.props.models[this.props.models.length - 1];
      this.setState(
        { creatingNewModel: false },
        () => addedModel && this.focusOnViewModelButton(addedModel.id)
      );
    }

    if (
      prevState.creatingNewModel &&
      !this.state.creatingNewModel &&
      !modelAdded
    ) {
      this.focusOnAddButton();
    }
  }

  // Focus Helpers
  focusOnAddButton() {
    this.addButton.current && this.addButton.current.focus();
  }

  focusOnViewModelButton = (modelId) =>
    this[`viewModelButton${modelId}`].current &&
    this[`viewModelButton${modelId}`].current.focus();

  // New Model
  startCreatingNewModel = () => this.setState({ creatingNewModel: true });

  cancelCreatingNewModel = () => {
    this.setState({ creatingNewModel: false });
    setTimeout(() => this.focusOnAddButton());
  };

  // Code
  toggleCode = () => this.setState({ codeOpen: !this.state.codeOpen });

  projectFileItem = () =>
    sequelize4.files({
      models: this.props.models,
      config: this.props.config,
    });

  render() {
    const { props, state } = this;

    const className = state.codeOpen
      ? "main-content project no-scroll"
      : "main-content project";

    return (
      <main className={className}>
        <div className="content-wrapper">
          <LegacyInfo />
          <h2 className="title">My Sequelize Project</h2>
          <ToolBelt>
            <Button icon="code" label="Code" onClick={this.toggleCode} />
          </ToolBelt>
          <List.Title className="models__title" text="Models" />
          <List.List className="models">
            {props.models.map((model) => (
              <List.Item key={model.id}>
                <List.Content>{model.name}</List.Content>
                <List.Actions>
                  <Button
                    ref={this[`viewModelButton${model.id}`]}
                    icon="view"
                    iconPosition="above"
                    onClick={() => props.goToModel(model.id)}
                    label="View"
                  />
                  <Button
                    icon="delete"
                    iconPosition="above"
                    onClick={() => props.deleteModel(model.id)}
                    label="Delete"
                  />
                </List.Actions>
              </List.Item>
            ))}
            <List.Item className="add-model">
              {state.creatingNewModel ? (
                <NewModelForm
                  models={props.models}
                  onCancel={this.cancelCreatingNewModel}
                  onCreate={props.createModel}
                />
              ) : props.models.length > 0 ? (
                <Button
                  ref={this.addButton}
                  icon="add"
                  label="Add a Model"
                  secondary
                  onClick={this.startCreatingNewModel}
                />
              ) : (
                <React.Fragment>
                  <p>You have no models</p>
                  <Button
                    ref={this.addButton}
                    icon="add"
                    label="Add a Model"
                    secondary
                    onClick={this.startCreatingNewModel}
                  />
                </React.Fragment>
              )}
            </List.Item>
          </List.List>
          <ToolBelt className="project-config" title="Database Options">
            <List.Item noBorder>
              <Checkbox
                id="config-timestamps"
                className="project-config__item"
                label="Timestamps"
                checked={props.config.timestamps}
                onCheck={props.toggleTimestamps}
              />
            </List.Item>
            <List.Item noBorder>
              <Checkbox
                id="config-snake"
                className="project-config__item"
                label="snake_case"
                checked={props.config.snake}
                onCheck={props.toggleSnake}
              />
            </List.Item>
            <List.Item noBorder>
              <Checkbox
                id="singluar-table-names"
                className="project-config__item"
                label="Singular Table Names"
                checked={props.config.singularTableNames}
                onCheck={props.toggleSingularTableNames}
              />
            </List.Item>
          </ToolBelt>
        </div>
        <CodeFlyout
          project
          open={this.state.codeOpen}
          onClose={this.toggleCode}
          newMessage={this.props.newMessage}
          fileItem={this.projectFileItem()}
        />
      </main>
    );
  }
}
