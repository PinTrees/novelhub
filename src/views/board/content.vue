<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="accent" dense flat dark>
        <v-toolbar-title v-text="info.title"></v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="write"><v-icon>mdi-pencil</v-icon></v-btn>
      </v-toolbar>
      <v-card-text v-if="info.createdAt">
        <v-alert color="info" outlined dismissible>
          <div style="white-space: pre-line">{{ info.description }}</div>
          <div class="text-right font-italic caption">
            작성일: {{ info.createdAt.toDate().toLocaleString() }}
          </div>
          <div class="text-right font-italic caption">
            수정일: {{ info.updatedAt.toDate().toLocaleString() }}
          </div>
        </v-alert>
      </v-card-text>
      <v-card-text> articles </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ["document"],
  data() {
    return {
      unsubscribe: null,
      info: {
        category: "",
        title: "",
        description: "",
      },
      loading: false,
    };
  },
  watch: {
    document() {
      this.read();
    },
  },
  created() {
    this.read();
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    subscribe() {
      if (this.unsubscribe) this.unsubscribe();
      const ref = this.$firebase
        .firestore()
        .collection("board-request")
        .doc(this.document);
      this.unsubscribe = ref.onSnapshot((doc) => {
        if (!doc.exists) return this.write();
        this.info = doc.data();
      });
    },
    async read() {
      const ref = this.$firebase
        .firestore()
        .collection("board-request")
        .doc(this.document);

      const sn = await ref.get();
      if (!sn.exists) return this.write();
      this.info = sn.data();
    },
    async write() {
      this.$router.push(this.$route.path + "/write");
    },
  },
};
</script>