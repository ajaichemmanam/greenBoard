import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
// import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
// // @material-ui/icons
// import Clear from "@material-ui/icons/Clear";
// import Check from "@material-ui/icons/Check";
// core components
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.jsx";

function CustomInput({ ...props }) {
  const {
    classes,
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
  } = props;



  const marginTop = classNames({
    [classes.marginTop]: labelText === undefined
  });
  return (
    // <FormControl
    //   {...formControlProps}
    //   className={formControlProps.className + " " + classes.formControl}
    // >
    //   {labelText !== undefined ? (
    //     <InputLabel
    //       className={classes.labelRoot}
    //       htmlFor={id}
    //       {...labelProps}
    //     >
        
    //     </InputLabel>
    //   ) : null}
    <Grid container spacing={8} alignItems="center">
    <div style={{color:"#AAAAAA", fontSize:"14px"}}>
          {labelText}
          </div>
      <Switch
        classes={{
          root: marginTop,
          disabled: classes.disabled,
          checked: classes.checked
        }}
        id={id}
        {...inputProps}
      />
      </Grid>
    // </FormControl>
  );
}

CustomInput.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object
};

export default withStyles(customInputStyle)(CustomInput);
