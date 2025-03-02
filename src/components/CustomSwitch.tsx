import { Box, Switch, Typography, SxProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

interface CustomSwitchProps {
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    textChecked?: string;
    checkedDescription?: string;
    textUnchecked?: string;
    uncheckedDescription?: string;
    sx?: SxProps<Theme>;
}

const StyledBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "auto",
    [theme.breakpoints.down("sm")]: {
        width: "100%",
        marginLeft: 0,
    },
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(2),
    },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
        color: theme.palette.success.main,
        "& + .MuiSwitch-track": {
            backgroundColor: theme.palette.success.main,
        },
    },
    "& .MuiSwitch-switchBase": {
        color: theme.palette.error.main,
        "&:not(.Mui-checked) + .MuiSwitch-track": {
            backgroundColor: theme.palette.error.main,
        },
    },
}));

export const CustomSwitch = React.forwardRef<HTMLDivElement, CustomSwitchProps>(
    (
        {
            checked,
            onChange,
            textChecked,
            checkedDescription,
            textUnchecked,
            uncheckedDescription,
            sx,
            ...other
        },
        ref,
    ) => {
        return (
            <StyledBox ref={ref} sx={sx} {...other}>
                <StyledSwitch checked={checked || false} onChange={onChange} />
                <Box ml={1}>
                    <Typography
                        variant="body2"
                        color={checked ? "success.main" : "error.main"}
                        fontWeight="bold"
                    >
                        {checked ? textChecked : textUnchecked}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                        {checked ? checkedDescription : uncheckedDescription}
                    </Typography>
                </Box>
            </StyledBox>
        );
    },
);

CustomSwitch.displayName = "CustomSwitch";
