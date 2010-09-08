require 'rubygems'
require 'active_support/inflector'

task :default => :spec

namespace :spec do

  desc 'Create a new Vava test suite'
  directory 'test/spec'
  task :new, :suite_name do |t, args|
    abort "Suite title is missing." unless args[:suite_name]

    suite_file_name = ActiveSupport::Inflector.underscore(args[:suite_name])
    suite_file_path = 'test/spec/' << suite_file_name << '.yml'
    
    unless File.exists?(suite_file_path)
      yaml = <<-YML
suite: "#{args[:suite_name]}"
specifications:
  
  - description: ""
YML
      File.open(suite_file_path, 'w') {|f| f.write(yaml) }
      puts "Created spec file `#{suite_file_path}`."
    else
      puts "File exists. Opening it."
    end

    Kernel::exec("mvim", suite_file_path)
  end

end
