<template>
  <q-page>
    <!-- le que se piensa es que cuando se le de al boton de reproduccion se ponga la tarea activada y con eso podemos manejar el temporizador  -->

    <!-- <q-btn
      color="white"
      text-color="black"
      label="Standard"
      @click="addTask()"
    /> -->
    <q-btn
      color="white"
      text-color="black"
      label="Standard"
      @click="loadData()"
    />
    <!-- <pre>
      {{ tasks }}
    </pre> -->
    <!--
    <q-btn
      color="white"
      text-color="black"
      label="Remo"
      @click="removeTask()"
    /> -->
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="pending">
        <div class="text-h6">Tareas pendientes</div>
        <template
          v-for="(item, i) in tasks"
          class="row justify-center content-start"
        >
          <q-card
            :key="i"
            :class="`bg-${item.color}`"
            class="my-card text-white q-ma-xs customBorder"
            v-if="item.status === 'pending'"
          >
            <q-card-section horizontal>
              <q-card-section class="col-1">
                <q-radio
                  style="position: absolute; top: 20px; left: 6px"
                  color="white"
                  keep-color
                  v-model="item.status"
                  @input="updateTask(item)"
                  val="completed"
                />
              </q-card-section>

              <q-card-section @click="itemActive(item)" class="col-8">
                <div class="text-h6">{{ item.title }}</div>
                <div class="text-subtitle2 truncateLabels">
                  {{ item.description }}
                </div>
                <q-chip outline color="white" text-color="white" icon="event">
                  {{ item.endingDate }}
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
                  {{ item.duration }} min
                </q-chip>
                <q-btn
                  style="position: absolute; top: 60px"
                  round
                  color="white"
                  :icon="item.startStop ? 'play_arrow' : 'pause'"
                  text-color="black"
                  size="19px"
                  dense
                  push
                  @click="
                    item.startStop ? startCounting(item) : stopCounting(item)
                  "
                />
              </q-card-section>
            </q-card-section>
            <!-- <q-card-section> -->

            <!-- </q-card-section> -->

            <!-- <q-card-actions class="q-py-none" align="right">
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions> -->
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
            :class="`bg-${item.color}`"
            class="my-card text-white q-ma-xs customBorder"
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
                <div class="text-h6">{{ item.title }}</div>
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
                  icon="av_timer"
                >
                  {{ item.duration }}
                </q-chip>
                <q-btn
                  style="position: absolute; top: 60px"
                  round
                  color="white"
                  icon="play_arrow"
                  text-color="black"
                  size="19px"
                  dense
                  push
                />
              </q-card-section>
            </q-card-section>
            <!-- <q-card-section> -->

            <!-- </q-card-section> -->

            <!-- <q-card-actions class="q-py-none" align="right">
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions> -->
          </q-card>
        </template>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog
      v-model="dialogTask"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="">
        <q-toolbar class="text-white" :class="`bg-${taskActive.color}`">
          <q-btn dense size="20px" flat icon="arrow_back" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>

          <!-- <q-toolbar-title>Quasar Framework</q-toolbar-title> -->
          <q-space />
          <q-btn dense size="20px" flat icon="delete_outline" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-toolbar>
        <!-- <q-bar :class="`bg-${taskActive.color} text-white`">
          <q-btn dense size="20px" flat icon="arrow_back" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
          <q-space />
          <q-btn dense flat icon="arrow_back" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar> -->

        <q-card-section>
          <div class="text-h6">{{ taskActive.title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item>
              <q-item-section side top>
                <q-icon color="primary" name="subject"></q-icon>
              </q-item-section>
              <q-item-section class="truncateLabels">
                {{ taskActive.description }}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-icon color="primary" name="event_available"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-chip outline color="primary" text-color="white">
                  {{ taskActive.endingDate }}
                </q-chip>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-icon color="primary" name="hourglass_top"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-chip outline color="primary" text-color="white">
                  {{ maxnum }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="q-pa-md flex flex-center">
            <q-circular-progress
              :value="taskActive.duration"
              show-value
              :class="`text-${taskActive.color} q-ma-md`"
              :color="taskActive.color"
              :max="maxnum"
              size="200px"
              :thickness="0.12"
              font-size="35px"
            >
              <div class="text-weight-bolder">
                {{ taskActive.duration }} <br />
                min
              </div>
            </q-circular-progress>
          </div>
          <div class="q-pa-none flex flex-center q-gutter-lg">
            <q-btn round color="primary" icon="restore" />
            <q-btn
              size="25px"
              round
              :color="taskActive.color"
              icon="play_arrow"
            />
            <q-btn round color="primary" icon="task_alt" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-footer
      class="bg-white text-primary"
      style="border-radius: 30px 0px 0px 0px"
    >
      <!-- <q-toolbar> -->
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
      <!-- </q-toolbar> -->
    </q-footer>

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
            color="primary"
            @click="addTask()"
          />
          <!-- v-close-popup -->
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
      taskActive: {
        title: "",
        description: "",
        color: "",
        date: "",
        time: "",
      },
      tasks: [
        {
          id: 1,
          title: "Ejemplo",
          description: "Esto es una desc",
          endingDate: "2022-12-12",
          duration: 630,
          recordedTime: "8923847",
          status: "pending",
          color: "purple-4",
          startStop: true,
        },
        {
          id: 2,
          title: "Ejemplo2",
          description: "",
          endingDate: "2022-12-12",
          duration: 130,
          recordedTime: "8923847",
          status: "completed",
          color: "cyan-4",
          startStop: true,
        },
        {
          id: 3,
          title: "Ejemplo3",
          description: "",
          endingDate: "2022-12-12",
          duration: 100,
          recordedTime: "8923847",
          status: "eliminate",
          color: "green",
          startStop: true,
        },
        {
          id: 4,
          title: "Ejemplo4",
          description: "",
          endingDate: "2022-12-12",
          duration: 450,
          recordedTime: "8923847",
          status: "pending",
          color: "blue",
          startStop: true,
        },
        {
          id: 5,
          title: "Ejemplo5",
          description: "Esto es una desc5",
          endingDate: "2022-12-12",
          duration: 30,
          recordedTime: "8923847",
          status: "pending",
          color: "green",
          startStop: true,
        },
      ],
    };
  },
  created() {
    this.loadData();
  },
  beforeDestroy() {
    console.log("hola");
    this.stopCounting();
  },
  methods: {
    updateTask(item) {
      // item.status = "completed";
      clearInterval(this.timer);
      item.startStop = true;
      console.log(item);
      // this.loadData();
    },
    startCounting(item) {
      clearInterval(this.timer);
      console.log(item.duration, typeof item.duration);
      // item.duration = setInterval(() => {
      //   item.duration--;
      //   console.log(item.duration);
      // }, 1000);
      this.timer = setInterval(() => {
        item.duration--;
        console.log(item.duration);
      }, 1000);
      item.startStop = false;
    },
    stopCounting(item) {
      clearInterval(this.timer);
      if (item) {
        item.startStop = true;
      }
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
          endingDate: datetask,
          duration: durationMinutes,
          recordedTime: 0,
          status: "pending",
          color: this.setColor,
          startStop: true,
        })
        .then((response) => {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

      // this.tasks.unshift({

      //   title: this.text,
      //   description: this.description,
      //   endingDate: datetask,
      //   duration: durationMinutes,
      //   recordedTime: 0,
      //   status: "pending",
      //   color: this.setColor,
      //   startStop: true,
      // });
      this.dialAdd = false;
      this.loadData();
      this.title = "";
      this.description = "";
      this.date = "";
      this.time = "";
      this.setColor = "";
    },
    itemActive(item) {
      console.log("item active");
      console.log(item);
      this.taskActive = item;
      this.maxnum = item.duration;
      this.dialogTask = true;
    },
    loadData() {
      api
        .get("/task")
        .then((response) => {
          console.log("respuesta");
          console.log(response);
          console.log(response.data.tasks);
          this.tasks = response.data.tasks;
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
