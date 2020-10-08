<template>
  <v-card>
    <v-card-title>request board</v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :options.sync="options"
      :server-items-length="serverItemsLength"
      must-sort
    >
      <template v-slot:item.id="{ item }">
        <v-btn icon @click="openDialog(item)"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
        <v-btn icon @click="remove(item)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
      <template v-slot:item.createdAt="{ item }">
        {{ item.createdAt.toLocaleString() }}
      </template>
    </v-data-table>
    <v-card-actions>
      <v-btn @click="read"><v-icon left>mdi-page-next</v-icon></v-btn>
      <v-btn @click="openDialog(null)"><v-icon left>mdi-pencil</v-icon></v-btn>
    </v-card-actions>
    <v-dialog max-width="500" v-model="dialog">
      <v-card>
        <v-form>
          <v-card-text>
            <v-form>
              <v-text-field v-model="form.title"></v-text-field>
              <v-text-field v-model="form.content"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="update" v-if="selectedItem">save</v-btn>
            <v-btn @click="add" v-else>save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { head, last } from "lodash";
export default {
  data() {
    return {
      headers: [
        { value: "createdAt", text: "작성일" },
        { value: "title", text: "제목" },
        { value: "content", text: "내용" },
        { value: "id", text: "uid", sortable: false },
      ],
      items: [],
      form: {
        title: "",
        content: "",
      },
      dialog: false,
      selectedItem: null,
      unsubscribe: null,
      unsubscribeCount: null,
      serverItemsLength: 0,
      options: {
        sortBy: ["createdAt"],
        sortDesc: [true],
      },
      docs: [],
    };
  },
  watch: {
    options: {
      handler(n, o) {
        const arrow = n.page - o.page;
        this.read(arrow);
      },
      deep: true,
    },
  },
  created() {
    //this.read();
    //this.subscribe();
  },
  destroyed() {
    if (this.unsubscribeCount) this.unsubscribeCount();
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    subscribe() {
      this.unsubscribeCount = this.$firebase
        .firestore()
        .content("meta")
        .doc("board-request")
        .onSnapshot((doc) => {
          if (!doc.exists) return;
        });

      this.unsubscribe = this.$firebase
        .firestore()
        .content("board-request")
        .onSnapshot((sn) => {
          if (sn.empty) {
            this.items = [];
            return;
          }
          this.items = sn.docs.map((v) => {
            const item = v.data();
            return {
              id: v.id,
              title: item.title,
              content: item.content,
            };
          });
        });
    },
    openDialog(item) {
      this.selectedItem = item;
      this.dialog = true;
      if (!item) {
        this.form.title = "";
        this.form.content = "";
      } else {
        this.form.title = item.title;
        this.form.content = item.content;
      }
    },
    add() {
      const item = {};
      Object.assign(item, this.form);
      item.createdAt = new Date();
      this.$firebase.firestore().collection("board-request").add(item);
      this.dialog = false;
      this.read();
    },
    update() {
      this.$firebase
        .firestore()
        .collection("board-request")
        .doc(this.selectedItem.id)
        .update(this.form);
      this.dialog = false;
    },
    async read(arrow) {
      const order = head(this.options.sortBy);
      const sort = head(this.options.sortDesc) ? "desc" : "asc";
      const limit = this.options.itemsPerPage;
      const ref = this.$firebase
        .firestore()
        .collection("board-request")
        .orderBy(order, sort);
      let query;
      switch (arrow) {
        case -1:
          query = ref.endBefore(head(this.docs)).limitToLast(limit);
          break;
        case 1:
          query = ref.startAfter(last(this.docs)).limit(limit);
          break;
        default:
          query = ref.limit(limit);
          break;
      }

      const sn = await query.get();
      sn.docs.forEach((v) => {
        console.log(v.id);
        console.log(v.data());
      });

      this.docs = sn.docs;
      console.log(head(sn.docs).data());
      console.log(last(sn.docs).data());
      this.items = sn.docs.map((v) => {
        const item = v.data();
        return {
          id: v.id,
          title: item.title,
          content: item.content,
          createdAt: item.createdAt.toDate(),
        };
      });
      this.readCount();
    },
    async readCount() {
      const sn = await this.$firebase
        .firestore()
        .collection("meta")
        .doc("board-request")
        .get();
      this.serverItemsLength = sn.data().count;
    },
    remove(item) {
      this.$firebase
        .firestore()
        .collection("board-request")
        .doc(item.id)
        .delete();
    },
  },
};
</script>