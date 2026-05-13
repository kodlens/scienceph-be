## SCIENCE PH BACKEND PANEL

### Application Requirements (Windows)
Install the following:

<ul>
  <li>
    <a href="https://getcomposer.org/">Composer</a>
  </li>
  <li>
    <a href="https://git-scm.com/">Git</a>
  </li>
  <li>
    <a href="https://www.apachefriends.org/download.html">XAMPP</a>
  </li>
  <li>
    <a href="https://nodejs.org/en">NodeJS</a>
  </li>
</ul>



### Tech 
    Laravel
    ReactJS
    MariaDB

### Versions
    Laravel 10
    ReactJS
    PHP 8.3
    MariaDB 10.1.28
    Node 20.15.1


### Installation

Clone the repository or run the command (only the collaborator can clone this repo)
```bash    
git clone https://github.com/kodlens/scienceph-be.git
```

Go to the repository (repo-name is publication-portal)
```bash
cd repo-name
```

Install the vendor
```bash
composer install
```

Install the node_modules
```bash
npm install
```

Run the server
```bash
php artisan serve
```

Open new bash/cmd, be sure you are on the root directory of the repository
```bash
npm run dev
```

Browse the application on localhost:8000

### Queue Setup

This project now uses Laravel queues for long-running tasks such as DOSTv migration.

Set the queue driver in your `.env`:
```bash
QUEUE_CONNECTION=database
```

Run database migrations, including the `jobs` table:
```bash
php artisan migrate
```

Start the queue worker:
```bash
php artisan queue:work --queue=external-migrations
```

Keep the worker terminal open while using queued features in the admin panel.

### DOSTv Migration

To migrate DOSTv materials from the admin page:

1. Start the Laravel app with `php artisan serve`
2. Start the frontend with `npm run dev`
3. Start the queue worker with `php artisan queue:work --queue=external-migrations`
4. Open the DOSTv admin page
5. Select the date range
6. Click `Migrate`

The request is queued immediately, then processed by the background worker. The page will poll the migration status and refresh when the job completes.


Error during build
```bash
https://github.com/react-component/picker/pull/765
```


Notes
    All status are static

    Roles (Publisher, Encoder,)
    (adviser, student, writer, desgner, editor)

    Change database structure
    Articles -> Materials
