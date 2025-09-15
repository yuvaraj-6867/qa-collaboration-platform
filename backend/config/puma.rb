# Puma configuration file

# Set the environment in which the rack's app will run.
environment ENV.fetch('RAILS_ENV', 'development')

# Store the pid of the server in the file at "path".
pidfile ENV.fetch('PIDFILE', 'tmp/pids/server.pid')

# Use "port" to specify the port that Puma will listen on to receive
# requests; default is 3000.
port ENV.fetch('PORT', 3001)

# Specifies the `worker_timeout` threshold that Puma will use to wait before
# terminating a worker in development environments.
worker_timeout 3600 if ENV.fetch('RAILS_ENV', 'development') == 'development'

# Specifies the number of `workers` to boot in clustered mode.
# Workers are forked web server processes. If using threads and workers together
# the concurrency of the application would be max `threads` * `workers`.
# Workers do not work on JRuby or Windows (both of which do not support
# processes).
workers ENV.fetch('WEB_CONCURRENCY', 2)

# Use the `preload_app!` method when specifying a `workers` number.
# This directive tells Puma to first boot the application and load code
# before forking the application. This takes advantage of Copy On Write
# process behavior so workers use less memory.
preload_app!

# Allow puma to be restarted by `bin/rails restart` command.
plugin :tmp_restart