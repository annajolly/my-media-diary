import React from 'react';
import { Box, Radio, useRadioGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
// import { fade } from '@mui/material/styles';

const Label = styled(Box, { shouldForwardProp: (prop) => prop !== 'isActive' })(
  ({ theme, isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    transition: theme.transitions.create(['box-shadow', 'border-color'], {
      duration: theme.transitions.duration.short,
    }),
    height: '100%',
    color: theme.palette.action.active,

    '&:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },

    '&:hover': {
      // backgroundColor: fade(palette.primary.main, 0.04),
    },

    ...(isActive && {
      color: theme.palette.primary.main,
      borderColor: 'transparent',
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    }),
  })
);

// const useStyles = makeStyles(({ shape, palette, spacing, transitions }) => ({
//   containerDisabled: {
//     cursor: 'not-allowed',
//     backgroundColor: palette.action.hover,
//     color: palette.text.disabled,

//     '&:hover': {
//       borderColor: palette.divider,
//       boxShadow: 'none',
//       backgroundColor: palette.action.hover,
//     },

//     '& *': {
//       color: palette.text.disabled,
//     },
//   },
//   containerActiveDisabled: {
//     cursor: 'not-allowed',
//     backgroundColor: palette.action.hover,
//     borderColor: 'transparent',
//     boxShadow: `0 0 0 2px ${palette.action.disabled}`,

//     '& * > svg': {
//       color: palette.text.disabled,
//     },

//     '&:hover': {
//       borderColor: 'transparent',
//       boxShadow: `0 0 0 2px ${palette.action.disabled}`,
//       backgroundColor: palette.action.hover,
//     },
//   },
//   containerWithoutRadio: {
//     // remove extra margin left of icon
//     '& div:nth-last-of-type(2)': {
//       marginLeft: 0,
//     },
//   },
//   radioButton: {
//     padding: 0,
//     margin: 2,
//   },
//   radioHidden: {
//     display: 'none',
//   },
// }));

export const CustomRadio = React.forwardRef((props, ref) => {
  const { label, disabled, className, hideRadio, value, RadioProps, ...rest } =
    props;
  // const classes = useStyles(props);
  const selectedRadio = useRadioGroup();

  const isActive = value === selectedRadio?.value;

  // const rootClasses = classNames(className, classes.container, {
  //   [classes.containerActive]: value === selectedRadio?.value,
  //   [classes.containerDisabled]: disabled && value !== selectedRadio?.value,
  //   [classes.containerActiveDisabled]:
  //     disabled && value === selectedRadio?.value,
  //   [classes.containerWithoutRadio]: hideRadio,
  // });

  // const radioClasses = classNames(classes.radioButton, {
  //   [classes.radioHidden]: hideRadio,
  // });

  return (
    <Label
      component="label"
      isActive={isActive}
      ref={ref}
      // className={rootClasses}
      {...rest}
    >
      <Radio
        color="primary"
        disabled={disabled}
        // className={radioClasses}
        value={value}
        icon={<span />}
        checkedIcon={<span />}
        {...RadioProps}
      />
      {label}
    </Label>
  );
});

export default CustomRadio;
