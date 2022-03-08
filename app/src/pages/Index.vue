<template>
  <q-page>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="pending">
        <!-- {{ tasks }} -->
        <q-card-section horizontal class="text-h6">
          Tareas pendientes
          <q-space />
        </q-card-section>
        <template v-if="imagShowWithoutTasks">
          <q-page class="flex flex-center">
            <q-img
              src="~assets/To-do-list.svg"
              style="width: 100%; height: 100%"
            >
              <div
                class="absolute-top text-center customBorder text-h6 bg-blue-3 text-weight-bolder"
              >
                No hay tareas pendientes
              </div>
            </q-img>
          </q-page>
        </template>
        <template
          v-for="(task, i) in tasks"
          class="row justify-center content-start"
        >
          <q-card
            :key="i"
            :class="`bg-${task.color}`"
            class="my-card text-white q-my-md customBorder"
            v-if="task.status === 'pending'"
          >
            <q-card-section horizontal>
              <q-card-section class="col-1">
                <q-radio
                  style="position: absolute; top: 20px; left: 6px"
                  color="white"
                  keep-color
                  v-model="task.status"
                  @input="completedTask(task)"
                  val="completed"
                />
              </q-card-section>
              <q-card-section @click="taskActive(task)" class="col-8">
                <div class="text-h6">{{ task.title }}</div>
                <div class="text-subtitle2 truncateLabels">
                  {{ task.description }}
                </div>
                <q-chip outline color="white" text-color="white" icon="event">
                  {{ task.endingDate }} - {{ task.endingTime }}
                </q-chip>
              </q-card-section>
              <q-card-section class="col-3">
                <q-chip
                  style="position: absolute; top: 15px; left: -15px"
                  outline
                  color="white"
                  text-color="white"
                  icon="hourglass_top"
                >
                  {{
                    selectedTask._id === task._id
                      ? selectedTaskDuration || "0"
                        ? selectedTaskDuration
                        : task.duration
                      : task.duration
                  }}
                  <pre><sub> min</sub></pre>
                </q-chip>
                <q-btn
                  style="position: absolute; top: 60px"
                  round
                  color="white"
                  :icon="
                    selectedTask._id === task._id
                      ? btnStartStop
                        ? 'pause'
                        : 'play_arrow'
                      : 'play_arrow'
                  "
                  text-color="black"
                  size="19px"
                  dense
                  push
                  @click="
                    selectedTask._id === task._id
                      ? btnStartStop
                        ? stopCounting(task)
                        : startCounting(task)
                      : startCounting(task)
                  "
                />
              </q-card-section>
            </q-card-section>
          </q-card>
        </template>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            push
            round
            size="20px"
            icon="add"
            color="primary"
            @click="dialAdd = true"
          />
        </q-page-sticky>
      </q-tab-panel>
      <q-tab-panel name="completed">
        <div class="text-h6">Tareas completadas</div>
        <template
          v-for="(item, i) in tasks"
          class="row justify-center content-start"
        >
          <q-card
            :key="i"
            class="bg-blue-grey-5 my-card text-white q-ma-xs customBorder"
            v-if="item.status === 'completed'"
          >
            <q-card-section horizontal>
              <q-card-section class="col-1">
                <q-radio
                  style="position: absolute; top: 20px; left: 6px"
                  color="white"
                  keep-color
                  v-model="item.status"
                  :val="item.status"
                  checked-icon="task_alt"
                />
              </q-card-section>
              <q-card-section @click="itemActive(item)" class="col-8">
                <div class="text-h6">
                  <strike>{{ item.title }}</strike>
                </div>
                <div class="text-subtitle2">{{ item.description }}</div>
                <q-chip outline color="white" text-color="white" icon="event">
                  {{ item.endingDate }}- {{ time }}
                </q-chip>
              </q-card-section>
              <q-card-section class="col-3">
                <q-chip
                  style="position: absolute; top: 15px; left: -10px"
                  outline
                  color="white"
                  text-color="white"
                  icon="hourglass_top"
                >
                  {{ item.duration }}
                  <pre><sub> min</sub></pre>
                </q-chip>
                <q-chip
                  style="position: absolute; top: 55px; left: -10px"
                  outline
                  color="white"
                  text-color="white"
                  icon="hourglass_bottom"
                >
                  {{ item.recordedTime }}
                  <pre><sub> min</sub></pre>
                </q-chip>
                <!-- <q-btn
                  style="position: absolute; top: 60px"
                  round
                  color="white"
                  icon="play_arrow"
                  text-color="black"
                  size="19px"
                  dense
                  push
                /> -->
              </q-card-section>
            </q-card-section>
          </q-card>
        </template>
      </q-tab-panel>
    </q-tab-panels>
    <q-footer
      class="bg-white text-primary"
      style="border-radius: 30px 0px 0px 0px"
    >
      <q-tabs
        style="border-radius: 30px 30px 0px 0px"
        v-model="tab"
        indicator-color="transparent"
        active-color="primary"
        class="text-grey-5 shadow-2"
      >
        <q-tab name="pending" label="pendiente"></q-tab>
        <q-tab name="completed" label="completada"></q-tab>
      </q-tabs>
    </q-footer>
    <!-- Diálog para ver, editar y eliminar una tarea pendiente  -->
    <q-dialog
      v-model="dialogTask"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="">
        <q-toolbar class="text-white" :class="`bg-${selectedTask.color}`">
          <q-btn
            dense
            size="20px"
            flat
            icon="arrow_back"
            v-close-popup
            @click="loadData()"
          >
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
          <q-space />
          <q-btn
            dense
            size="20px"
            flat
            icon="delete_outline"
            @click="deletedTask(selectedTask)"
          >
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
          <q-btn
            v-if="btnUpdate"
            dense
            size="20px"
            flat
            icon="save_as"
            @click="updateTask(selectedTask)"
          >
            <q-tooltip content-class="bg-white text-primary">save</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="text-h6">
            {{ selectedTask.title }}
            <q-popup-edit v-model="selectedTask.title">
              <template v-slot="scope">
                <q-input
                  v-on:keyup.enter="btnUpdate = true"
                  autofocus
                  dense
                  v-model="scope.value"
                >
                  <template v-slot:after>
                    <q-btn
                      flat
                      dense
                      color="negative"
                      icon="cancel"
                      @click.stop="scope.cancel"
                    />
                    <q-btn
                      flat
                      dense
                      color="positive"
                      icon="check_circle"
                      @click.stop="scope.set"
                      :disable="
                        scope.validate(scope.value) === false ||
                        scope.initialValue === scope.value
                      "
                      @click="btnUpdate = true"
                    />
                  </template>
                </q-input>
              </template>
            </q-popup-edit>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-list>
            <q-item>
              <q-item-section side top>
                <q-icon color="primary" name="subject"></q-icon>
              </q-item-section>
              <q-item-section>
                {{ selectedTask.description }}
              </q-item-section>
              <q-popup-edit v-model="selectedTask.description">
                <template v-slot="scope">
                  <q-input
                    v-on:keyup.enter="btnUpdate = true"
                    autofocus
                    dense
                    v-model="scope.value"
                  >
                    <template v-slot:after>
                      <q-btn
                        flat
                        dense
                        color="negative"
                        icon="cancel"
                        @click.stop="scope.cancel"
                      />
                      <q-btn
                        flat
                        dense
                        color="positive"
                        icon="check_circle"
                        @click.stop="scope.set"
                        :disable="
                          scope.validate(scope.value) === false ||
                          scope.initialValue === scope.value
                        "
                        @click="btnUpdate = true"
                      />
                    </template>
                  </q-input>
                </template>
              </q-popup-edit>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-icon color="primary" name="event_available"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-chip outline color="primary" text-color="white">
                  {{ selectedTask.endingDate }} - {{ selectedTask.endingTime }}
                </q-chip>
              </q-item-section>
              <q-popup-proxy>
                <q-date v-model="selectedTask.endingDate">
                  <q-field
                    class="q-py-none"
                    rounded
                    standout="bg-primary text-white"
                    bottom-slots
                    stack-label
                    dense
                  >
                    <q-popup-proxy>
                      <q-time
                        v-model="selectedTask.endingTime"
                        :format24h="false"
                      >
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn
                            label="Cancel"
                            color="primary"
                            flat
                            v-close-popup
                          />
                          <q-btn
                            label="OK"
                            color="primary"
                            flat
                            v-close-popup
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                    <template v-slot:prepend>
                      <q-icon name="schedule" />
                    </template>
                    <template v-slot:control>
                      <div
                        class="self-center full-width no-outline"
                        tabindex="0"
                      >
                        {{
                          selectedTask.endingTime
                            ? selectedTask.endingTime
                            : "Estableser hora"
                        }}
                      </div>
                    </template>
                  </q-field>
                  <div
                    class="row items-center justify-end q-gutter-sm q-py-none"
                  >
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn
                      label="OK"
                      @click="
                        updateDurationMinutes(
                          selectedTask.endingDate,
                          selectedTask.endingTime
                        ),
                          (btnUpdate = true)
                      "
                      color="primary"
                      flat
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-icon color="primary" name="hourglass_top"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-chip outline color="primary" text-color="white">
                  {{
                    newDurationMinutes
                      ? newDurationMinutes
                      : selectedTask.duration
                  }}
                  minutos
                  <!-- {{ newDurationMinutes ? newDurationMinutes : maxnum }} -->
                </q-chip>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-icon color="primary" name="palette"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-chip :color="selectedTask.color"> </q-chip>
              </q-item-section>
              <q-popup-proxy>
                <q-card style="border-radius: 20px">
                  <q-card-section
                    class="q-gutter-xs row justify-center content-start"
                  >
                    <q-btn
                      push
                      style="width: 100px; height: 100px"
                      :color="item.color"
                      v-for="(item, i) in paleteColor"
                      :key="`xs-${i}`"
                      v-close-popup
                      @click="
                        (selectedTask.color = item.color), (btnUpdate = true)
                      "
                    ></q-btn>
                  </q-card-section>
                </q-card>
              </q-popup-proxy>
            </q-item>
          </q-list>
          <div class="q-pa-md flex flex-center">
            <q-circular-progress
              :value="selectedTaskDuration"
              show-value
              :class="`text-${selectedTask.color} q-ma-md`"
              :color="selectedTask.color"
              :max="maxnum"
              size="200px"
              :thickness="0.12"
              font-size="35px"
            >
              <div style="text-align: right" class="text-weight-bolder">
                {{ selectedTaskDuration }} <br />
                min
              </div>
            </q-circular-progress>
          </div>
          <div class="q-pa-none flex flex-center q-gutter-lg">
            <q-btn
              round
              color="primary"
              icon="restore"
              @click="resetCounting(selectedTask)"
            />
            <q-btn
              size="25px"
              round
              :color="selectedTask.color"
              :icon="btnStartStop ? 'pause' : 'play_arrow'"
              @click="
                btnStartStop
                  ? stopCounting(selectedTask)
                  : startCounting(selectedTask)
              "
            />
            <q-btn
              round
              color="primary"
              icon="task_alt"
              @click="completedTask(selectedTask)"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- ------------------------------------------------------  -->
    <q-dialog v-model="dialAdd">
      <q-card style="border-radius: 25px; width: 100%; max-width: 370px">
        <q-card-section :class="`bg-${setColor}`">
          <div class="text-h6" :class="setColor ? 'text-white' : ''">
            Nueva tarea
          </div>
        </q-card-section>
        <q-card-section class="q-py-none q-gutter-sm">
          <q-input
            rounded
            standout="bg-primary text-white"
            v-model="text"
            label="Nueva tarea"
            autofocus
          />
          <q-input
            v-if="btnDescription"
            rounded
            standout="bg-primary text-white"
            v-model="description"
            label="Agregar detalles"
            autofocus
          />
          <q-chip
            v-if="date"
            outline
            color="primary"
            text-color="white"
            icon="event"
          >
            {{ date }} - {{ time }}
          </q-chip>
        </q-card-section>
        <q-card-section class="q-py-none">
          <q-btn
            flat
            round
            color="primary"
            icon="subject"
            @click="btnDescription = true"
          />
          <q-btn flat round color="primary" icon="event_available">
            <q-popup-proxy>
              <q-date v-model="date">
                <q-field
                  class="q-py-none"
                  rounded
                  standout="bg-primary text-white"
                  bottom-slots
                  stack-label
                  dense
                >
                  <q-popup-proxy>
                    <q-time v-model="time" :format24h="false">
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn
                          label="Cancel"
                          color="primary"
                          flat
                          v-close-popup
                        />
                        <q-btn label="OK" color="primary" flat v-close-popup />
                        <!-- @click="save" -->
                      </div>
                    </q-time>
                  </q-popup-proxy>
                  <template v-slot:prepend>
                    <q-icon name="schedule" />
                  </template>

                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">
                      {{ time === "" ? "Estableser hora" : time }}
                    </div>
                  </template>
                </q-field>
                <div class="row items-center justify-end q-gutter-sm q-py-none">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat v-close-popup />
                  <!-- @click="save" -->
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
          <q-btn flat round color="primary" icon="palette">
            <q-popup-proxy>
              <q-card style="border-radius: 20px">
                <q-card-section
                  class="q-gutter-xs row justify-center content-start"
                >
                  <q-btn
                    push
                    style="width: 100px; height: 100px"
                    :color="item.color"
                    v-for="(item, i) in paleteColor"
                    :key="`xs-${i}`"
                    v-close-popup
                    @click="setColor = item.color"
                  ></q-btn>
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-btn>
        </q-card-section>
        <q-card-actions class="q-pt-none" align="right">
          <q-btn
            :disable="text === ''"
            flat
            label="Guardar"
            :color="text ? 'primary' : 'blue-grey'"
            @click="addTask()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import { date } from "quasar";
export default {
  name: "PageIndex",
  data() {
    return {
      imagShowWithoutTasks: true,
      selectedTaskDuration: null,
      btnUpdate: false,
      btnStartStop: false,
      newDurationMinutes: null,
      maxnum: 0,
      btnstartCant: false,
      btnDescription: false,
      setColor: "",
      paleteColor: [
        { color: "purple-4" },
        { color: "cyan-4" },
        { color: "green-3" },
        { color: "teal-4" },
        { color: "blue-3" },
        { color: "red-3" },
      ],
      hex: "#FF00FF",
      tab: "pending",
      dialogTask: false,
      dialAdd: false,
      description: "",
      shape: "",
      text: "",
      date: "",
      time: "",
      dateH: "",
      selectedTask: {
        description: null,
        duration: null,
        endingDate: null,
        endingTime: null,
        recordedTime: null,
        startStop: null,
        status: null,
        title: null,
        __v: null,
        _id: null,
      },
      tasks: [],
    };
  },
  created() {
    this.loadData();
    console.log(this.initimg(this.tasks));
  },
  beforeDestroy() {
    console.log("hola");
    this.stopCounting();
  },
  computed: {
    reversedMessage() {
      console.log("coputed pro");
      console.log(this.task);
      return "hola";
    },
  },
  methods: {
    secondsToString(seconds) {
      let hour = Math.floor(seconds / 3600);
      hour = hour < 10 ? "0" + hour : hour;
      let minute = Math.floor((seconds / 60) % 60);
      minute = minute < 10 ? "0" + minute : minute;
      let second = seconds % 60;
      second = second < 10 ? "0" + second : second;
      return hour + ":" + minute + ":" + second;
    },
    initimg(tasks) {
      console.log("hola dendnalkfalkj");
      console.log(Object.entries(tasks));
    },
    filterTask() {
      // this.tasks = this.tasks.sort();
      // this.tasks = this.tasks.filter((task) => {
      //   if (this.tab === "pending") {
      //     return task.status === "pending";
      //   } else if (this.tab === "completed") {
      //     return task.status === "completed";
      //   }
      // });
    },
    updateDurationMinutes(endingDate, endingTime) {
      let timeStamp = Date.now();
      let formattedString = date.formatDate(timeStamp, "YYYY/MM/DD-HH:mm:ss");
      let datetask = endingDate + "-" + endingTime;
      this.newDurationMinutes = date.getDateDiff(
        datetask,
        formattedString,
        "minutes"
      );
    },
    resetCounting(task) {
      this.selectedTaskDuration = Math.floor(task.duration * 1000);
    },
    completedTask(task) {
      this.stopCounting();
      if (this.selectedTaskDuration < 0) {
        task.recordedTime = task.duration - this.selectedTaskDuration;
      } else {
        task.recordedTime = this.selectedTaskDuration;
      }
      task.status = "completed";
      this.dialogTask = false;
      api
        .put("/updateTask", task)
        .then((response) => {
          console.log(response);
          this.loadData();
          this.selectedTask = {
            description: null,
            duration: null,
            endingDate: null,
            endingTime: null,
            recordedTime: null,
            startStop: null,
            status: null,
            title: null,
            __v: null,
            _id: null,
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deletedTask(task) {
      this.$q
        .dialog({
          title: "Eliminar tarea",
          message: "¿Seguro de eliminar la tarea? ",
          style: "border-radius: 20px",
          ok: {
            push: true,
            color: "negative",
          },
          cancel: {
            push: true,
          },
          persistent: true,
        })
        .onOk(() => {
          task.status = "deleted";
          api
            .put("/deletedTask", task)
            .then(() => {
              this.stopCounting();
              this.dialogTask = false;
              this.$q.notify({
                type: "positive",
                message: `Tarea eliminada`,
                position: "top",
              });
              this.loadData();
            })
            .catch((error) => {
              console.log(error);
            });
        });
    },
    updateTask(task) {
      this.newDurationMinutes
        ? (task.duration = this.newDurationMinutes)
        : (task.duration = task.duration);
      api
        .put("/updateTask", task)
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: `Tarea actualizada`,
            position: "top",
          });
          this.newDurationMinutes = null;
          this.loadData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    startCounting(task) {
      console.log("start counting");
      console.log(task);
      console.log(task.duration);
      console.log(Math.floor(task.duration * 60));
      console.log(this.secondsToString(Math.floor(task.duration * 60)));
      console.log(this.selectedTask._id);
      if (this.selectedTask._id) {
        if (this.selectedTask._id === task._id) {
          this.btnStartStop = true;
          this.timer = setInterval(() => {
            this.selectedTaskDuration--;
            console.log(this.selectedTaskDuration);
          }, 1000);
        } else {
          this.$q
            .dialog({
              title: "Tarea en progreso ",
              message: "Hay una tarea en progreso desea cancelarla",
              cancel: true,
              persistent: true,
              style: "border-radius: 20px",
            })
            .onOk(() => {
              // console.log('>>>> OK')
            })
            .onOk(() => {
              // console.log('>>>> second OK catcher')
            })
            .onCancel(() => {
              // console.log('>>>> Cancel')
            })
            .onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            });
        }
      } else {
        console.log("asignando");
        this.selectedTask = task;
        this.selectedTaskDuration = Math.floor(task.duration * 60);
        this.btnStartStop = true;
        this.timer = setInterval(() => {
          this.selectedTaskDuration--;
          console.log(this.selectedTaskDuration);
        }, 1000);
      }
    },
    stopCounting() {
      clearInterval(this.timer);
      this.btnStartStop = false;
      // if (item) {
      //   item.startStop = true;
      // }
    },
    addTask() {
      let timeStamp = Date.now();
      let formattedString = date.formatDate(timeStamp, "YYYY/MM/DD-HH:mm:ss");
      let datetask = this.date + "-" + this.time;
      if (this.setColor === "") {
        this.setColor = "purple-4";
      }
      if (datetask === "-") {
        datetask = date.addToDate(formattedString, { minutes: 5 });
      }
      datetask = date.formatDate(datetask, "YYYY/MM/DD-HH:mm:ss");
      let durationMinutes = date.getDateDiff(
        datetask,
        formattedString,
        "minutes"
      );
      api
        .post("/create", {
          title: this.text,
          description: this.description,
          endingDate: this.date,
          endingTime: this.time,
          duration: durationMinutes,
          recordedTime: 0,
          status: "pending",
          color: this.setColor,
          startStop: true,
        })
        .then(() => {
          this.text = "";
          this.description = "";
          this.date = "";
          this.time = "";
          this.setColor = "";
          this.dialAdd = false;
          this.btnDescription = false;
          this.$q.notify({
            type: "positive",
            message: `Tarea guardada`,
            position: "top",
          });
          this.loadData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    taskActive(task) {
      console.log("task active");
      console.log(task);
      console.log(this.selectedTask);
      if (this.selectedTask._id) {
        //   console.log("dentro");
        //   if (this.selectedTask._id === task._id) {
        //     console.log("esto es igul");
        //   } else {
        //     console.log("esto no es igual ");
        //     this.selectedTask = task;
        //     // this.selectedTask = task;
        //     // this.maxnum = task.duration;
        //     // this.selectedTaskDuration = task.duration;
        //     // this.dialogTask = true;
        //   }
      } else {
        // this.dialogTask = true;
        this.maxnum = Math.floor(task.duration * 60);
        this.selectedTask = task;
        this.selectedTaskDuration = Math.floor(task.duration * 60);
        // this.maxnum = task.duration;
        // this.selectedTaskDuration = task.duration;
      }
      this.dialogTask = true;
      // this.selectedTask = task;

      // this.selectedTask = task;
      // this.maxnum = task.duration;
    },
    loadData() {
      this.btnUpdate = false;
      api
        .get("/task")
        .then((response) => {
          let taskpendig = [];
          Object.entries(response.data.tasks).forEach(([key, value]) => {
            if (value.status === "pending") {
              taskpendig.push(value);
            }
          });
          taskpendig.length === 0
            ? (this.imagShowWithoutTasks = true)
            : (this.imagShowWithoutTasks = false);
          console.log(taskpendig.length);
          this.tasks = response.data.tasks;

          // this.selectedTask = {
          //   description: null,
          //   duration: null,
          //   endingDate: null,
          //   endingTime: null,
          //   recordedTime: null,
          //   startStop: null,
          //   status: null,
          //   title: null,
          //   __v: null,
          //   _id: null,
          // };
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    },
    removeTask() {
      api
        .get("/removeTask")
        .then((response) => {
          console.log("respuesta");
          console.log(response);
          console.log(response.data.tasks);
          // this.data = response.data;
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    },
    ejemplopo() {
      api
        .post("/create", {
          title: "Ejemplo",
          description: "Esto es una desc",
          endingDate: "1999",
          duration: "198",
          recordedTime: "8923847",
          status: "false",
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    add() {
      this.tasks.unshift({
        text: this.text,
        done: false,
      });
      this.text = "";
      this.dialAdd = false;
    },
  },
};
</script>
<style>
.my-card {
  width: 100%;
  height: 125px;
  max-width: 400px;
  max-height: 250px;
}
.customBorder {
  border-radius: 25px;
}
.truncateLabels {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
