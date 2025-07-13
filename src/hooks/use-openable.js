import React from 'react';

export const useOpenable = (
  initialState = {
    anchorEl: null,
    isOpen: false,
  }
) => {
  const [openable, setOpenable] = React.useState(initialState);

  const open = React.useCallback((event) => {
    const { currentTarget = null } = event || {};

    setOpenable({
      anchorEl: currentTarget,
      isOpen: true,
    });
  }, []);

  const close = React.useCallback(() => {
    setOpenable({
      anchorEl: null,
      isOpen: false,
    });
  }, []);

  return React.useMemo(
    () => ({
      ...openable,
      open,
      close,
      toggle: openable.isOpen ? close : open,
    }),
    [openable, open, close]
  );
};
