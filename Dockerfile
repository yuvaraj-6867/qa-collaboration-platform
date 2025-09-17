FROM ruby:3.3.0

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libyaml-dev \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/Gemfile* ./
RUN bundle install

COPY backend/ ./

EXPOSE 3000

CMD bundle exec puma -C config/puma.rb