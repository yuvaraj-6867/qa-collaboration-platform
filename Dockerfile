FROM ruby:3.3.0

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libyaml-dev \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock from backend directory
COPY backend/Gemfile backend/Gemfile.lock ./

# Install Ruby dependencies
RUN bundle install

# Copy the rest of the backend application
COPY backend/ ./

# Expose port
EXPOSE 3000

# Start the Rails server
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]