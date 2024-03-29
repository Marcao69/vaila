import React, { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import ColorPicker from "../ColorPicker";
import {
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
} from "@material-ui/core";
import { Colorize } from "@material-ui/icons";
import { QueueOptions } from "../QueueOptions";
import SchedulesForm from "../SchedulesForm";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },

  btnWrapper: {
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  colorAdorment: {
    width: 20,
    height: 20,
  },
}));

const QueueSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  color: Yup.string().min(3, "Too Short!").max(9, "Too Long!").required(),
  greetingMessage: Yup.string(),
  isChatbot: Yup.boolean(),
});

const QueueModal = ({ open, onClose, queueId, companyId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    color: "",
    greetingMessage: "",
    outOfHoursMessage: "",
    tempoRoteador: "0",
    ativarRoteador: false,
    isChatbot: false,
    orderQueue: null,
    typebotStatus: false,
    typebotDelayMessage: 1000,
    typebotExpires: 0,
    typebotKeywordFinish: "",
    typebotSlug: "",
    typebotUnknownMessage: "",
  };

  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [queue, setQueue] = useState(initialState);
  const [tab, setTab] = useState(0);
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);
  const greetingRef = useRef();

  const [schedules, setSchedules] = useState([
    { weekday: "Segunda-feira", weekdayEn: "monday", startTime: "08:00", endTime: "18:00", },
    { weekday: "Terça-feira", weekdayEn: "tuesday", startTime: "08:00", endTime: "18:00", },
    { weekday: "Quarta-feira", weekdayEn: "wednesday", startTime: "08:00", endTime: "18:00", },
    { weekday: "Quinta-feira", weekdayEn: "thursday", startTime: "08:00", endTime: "18:00", },
    { weekday: "Sexta-feira", weekdayEn: "friday", startTime: "08:00", endTime: "18:00", },
    { weekday: "Sábado", weekdayEn: "saturday", startTime: "08:00", endTime: "12:00", },
    { weekday: "Domingo", weekdayEn: "sunday", startTime: "00:00", endTime: "00:00", },
  ]);

  useEffect(() => {
    api.get(`/settings`).then(({ data }) => {
      if (Array.isArray(data)) {
        const scheduleType = data.find((d) => d.key === "scheduleType");
        if (scheduleType) {
          setSchedulesEnabled(scheduleType.value === "queue");
        }
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (!queueId) return;
      try {
        const { data } = await api.get(`/queue/${queueId}`);
        setQueue((prevState) => {
          return { ...prevState, ...data };
        });
        setSchedules(data.schedules);
      } catch (err) {
        toastError(err);
      }
    })();

    return () => {
      setQueue({
        name: "",
        color: "",
        greetingMessage: "",
        outOfHoursMessage: "",
        tempoRoteador: "",
        ativarRoteador: false,
        isChatbot: false,
        orderQueue: null,
        typebotStatus: false,
        typebotDelayMessage: 1000,
        typebotExpires: 0,
        typebotKeywordFinish: "",
        typebotSlug: "",
        typebotUnknownMessage: "",
      });
    };
  }, [queueId, open]);

  const handleClose = () => {
    onClose();
    setQueue(initialState);
  };

  const handleSaveQueue = async (values) => {
    try {
      if (queueId) {
        await api.put(`/queue/${queueId}`, { ...values, schedules });
      } else {
        await api.post("/queue", { ...values, schedules });
      }
      toast.success("Queue saved successfully");
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleSaveSchedules = async (values) => {
    toast.success("Clique em salvar para registar as alterações");
    setSchedules(values);
    setTab(0);
  };

  return (
    <div className={classes.root}>
      <Dialog
        maxWidth="md"
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle>
          {queueId
            ? `${i18n.t("queueModal.title.edit")}`
            : `${i18n.t("queueModal.title.add")}`}
        </DialogTitle>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_, v) => setTab(v)}
          aria-label="disabled tabs example"
        >
          <Tab label="Dados da Fila" />
          <Tab label="Typebot" />
          {schedulesEnabled && <Tab label="Horários de Atendimento" />}
        </Tabs>
        <Formik
          initialValues={queue}
          enableReinitialize={true}
          validationSchema={QueueSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveQueue(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <DialogContent dividers>
                {tab === 0 && (
                  <Paper>
                    <Field
                      as={TextField}
                      label={i18n.t("queueModal.form.name")}
                      autoFocus
                      name="name"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                    <Field
                      as={TextField}
                      label={i18n.t("queueModal.form.color")}
                      name="color"
                      id="color"
                      onFocus={() => {
                        setColorPickerModalOpen(true);
                        greetingRef.current.focus();
                      }}
                      error={touched.color && Boolean(errors.color)}
                      helperText={touched.color && errors.color}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <div
                              style={{ backgroundColor: values.color }}
                              className={classes.colorAdorment}
                            ></div>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => setColorPickerModalOpen(true)}
                          >
                            <Colorize />
                          </IconButton>
                        ),
                      }}
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                    <ColorPicker
                      open={colorPickerModalOpen}
                      handleClose={() => setColorPickerModalOpen(false)}
                      onChange={(color) => {
                        values.color = color;
                        setQueue(() => {
                          return { ...values, color };
                        });
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Field
                          as={Switch}
                          color="primary"
                          name="ativarRoteador"
                          checked={values.ativarRoteador}
                        />
                      }
                      label="Rodízio"
                    />
                    <Field
                      as={Select}
                      label="Tempo de Rodízio"
                      name="tempoRoteador"
                      error={touched.tempoRoteador && Boolean(errors.tempoRoteador)}
                      helperText={touched.tempoRoteador && errors.tempoRoteador}
                      variant="outlined"
                      margin="dense"
                      className={classes.selectField}
                    >
                      <MenuItem value="0" selected disabled>Tempo de Rodízio</MenuItem>
                      <MenuItem value="2">2 minutos</MenuItem>
                      <MenuItem value="5">5 minutos</MenuItem>
                      <MenuItem value="10">10 minutos</MenuItem>
                      <MenuItem value="15">15 minutos</MenuItem>
                      <MenuItem value="30">30 minutos</MenuItem>
                      <MenuItem value="45">45 minutos</MenuItem>
                      <MenuItem value="60">60 minutos</MenuItem>
                    </Field>
                    <div style={{ marginTop: 5 }}>
                      <Field
                        as={TextField}
                        label={i18n.t("queueModal.form.greetingMessage")}
                        type="greetingMessage"
                        multiline
                        inputRef={greetingRef}
                        rows={5}
                        fullWidth
                        name="greetingMessage"
                        error={
                          touched.greetingMessage &&
                          Boolean(errors.greetingMessage)
                        }
                        helperText={
                          touched.greetingMessage && errors.greetingMessage
                        }
                        variant="outlined"
                        margin="dense"
                      />
                      {schedulesEnabled && (
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.outOfHoursMessage")}
                          type="outOfHoursMessage"
                          multiline
                          rows={5}
                          fullWidth
                          name="outOfHoursMessage"
                          error={
                            touched.outOfHoursMessage &&
                            Boolean(errors.outOfHoursMessage)
                          }
                          helperText={
                            touched.outOfHoursMessage && errors.outOfHoursMessage
                          }
                          variant="outlined"
                          margin="dense"
                        />
                      )}
                    </div>
                    <QueueOptions
                      queueId={queueId}
                      companyId={companyId}
                    />
                  </Paper>

                )}
                {tab === 1 && (
                  <Paper style={{ padding: 20 }}>
                    <Grid spacing={1} container>
                      <Grid item xs={8} md={8} xl={8} >
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.typebotUrl")}
                          name="typebotUrl"
                          error={touched.typebotUrl && Boolean(errors.typebotUrl)}
                          helpertext={touched.typebotUrl && errors.typebotUrl}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={4} md={4} xl={4} >
                        <FormControlLabel
                          control={
                            <Field
                              as={Switch}
                              color="primary"
                              name="typebotStatus"
                              checked={values.typebotStatus}
                            />
                          }
                          label={i18n.t("queueModal.form.typebotStatus")}
                        />
                      </Grid>
                    </Grid>
                    <Grid spacing={1} container>

                      <Grid item xs={12} md={6} xl={6} >
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.typebotSlug")}
                          name="typebotSlug"
                          error={touched.typebotSlug && Boolean(errors.typebotSlug)}
                          helpertext={touched.typebotSlug && errors.typebotSlug}
                          required={values.typebotUrl !== "" && values.typebotUrl !== undefined}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} xl={6} >
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.typebotExpires")}
                          name="typebotExpires"
                          error={touched.typebotExpires && Boolean(errors.typebotExpires)}
                          helpertext={touched.typebotExpires && errors.typebotExpires}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} xl={6} >
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.typebotDelayMessage")}
                          name="typebotDelayMessage"
                          error={touched.typebotDelayMessage && Boolean(errors.typebotDelayMessage)}
                          helpertext={touched.typebotDelayMessage && errors.typebotDelayMessage}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} xl={6} >
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.typebotKeywordFinish")}
                          name="typebotKeywordFinish"
                          error={touched.typebotKeywordFinish && Boolean(errors.typebotKeywordFinish)}
                          helpertext={touched.typebotKeywordFinish && errors.typebotKeywordFinish}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} xl={6} >
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.typebotKeywordRestart")}
                          name="typebotKeywordRestart"
                          error={touched.typebotKeywordRestart && Boolean(errors.typebotKeywordRestart)}
                          helpertext={touched.typebotKeywordRestart && errors.typebotKeywordRestart}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} xl={6} >
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.typebotUnknownMessage")}
                          name="typebotUnknownMessage"
                          error={touched.typebotUnknownMessage && Boolean(errors.typebotUnknownMessage)}
                          helpertext={touched.typebotUnknownMessage && errors.typebotUnknownMessage}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} xl={12} >
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.typebotRestartMessage")}
                          name="typebotRestartMessage"
                          error={touched.typebotRestartMessage && Boolean(errors.typebotRestartMessage)}
                          helpertext={touched.typebotRestartMessage && errors.typebotRestartMessage}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.textField}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                )}
                {tab === 2 && (
                  <Paper style={{ padding: 20 }}>
                    <SchedulesForm
                      loading={false}
                      onSubmit={handleSaveSchedules}
                      initialValues={schedules}
                      labelSaveButton="Adicionar"
                    />
                  </Paper>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("queueModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {queueId
                    ? `${i18n.t("queueModal.buttons.okEdit")}`
                    : `${i18n.t("queueModal.buttons.okAdd")}`}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div >
  );
};

export default QueueModal;
