<template>
  <q-page padding>
    <q-btn
      to="/settings"
      color="primary"
      icon="chevron_left"
      label="Back"
      flat
    />
    <div class="container">
      <h5>How to Use the To-Do List</h5>
      <hr>
    <section>
        <p>
            This guide explains how to use your to-do list application to create, organize, and complete tasks efficiently.
        </p>
    </section>

    <section>
        <h6>Creating New Tasks</h6>
        <hr>
        <ul>
            <li>Press the <strong>plus (+) button</strong> to add a new task.</li>
            <li>After creating it, you can customize its name, due date, and due time.</li>
        </ul>
    </section>

    <section>
        <h6>Editing Existing Tasks</h6>
        <hr>
        <ul>
            <li>You can modify or delete the default tasks at any time.</li>
            <li>Tap or click on a task to edit its name, due date, or due time.</li>
        </ul>
    </section>

    <section>
        <h6>Completing Tasks</h6>
        <hr>
        <ul>
            <li>From the task list, check the checkbox next to any task you have completed.</li>
            <li>Completed tasks are instantly marked, making it easy to see your progress.</li>
        </ul>
    </section>

    <section>
        <h6>Sorting and Searching Tasks</h6>
        <hr>
        <ul>
            <li>You can sort your tasks by <strong>name</strong> or by <strong>date</strong> for better organization.</li>
            <li>Use the <strong>search bar</strong> to quickly find a specific task.</li>
        </ul>
    </section>

    <section>
        <h6>Settings Options</h6>
        <hr>
        <ul>
            <li>You can change the <strong>hour time format</strong> (for example, 12-hour or 24-hour format).</li>
            <li>You can choose to <strong>show tasks and completed tasks in a single combined list</strong>.</li>
        </ul>
    </section>
    </div>
     
  </q-page>
</template>

<script>
export default {

}
</script>
 <style>
    .container {
      padding-top: 20px;
    }
       
    h5 , h6 {
        color: #2c3e50;
        margin: 0px;
    }
    
    strong {
        color: #2c3e50;
    }
    hr {
        opacity: 0.5;
    }
    </style>