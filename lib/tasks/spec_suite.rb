require 'yaml'
require 'rdiscount'

class SpecSuite
  class Specification < Struct.new(:description, :test_files)

    def initialize(description, test_files)
      super
      self.test_files ||= []
    end
    
    def test(base_path)
      return 0 if test_files.empty?

      test_files.each do |test_file|
        return -1 unless run_test_file(test_file)
      end

      1
    end

    def run_test_file(test_file)
      true 
    end

  end

  COLOR_TABLE = {
    -1 => 'test-failed',
     0 => 'test-missing',
     1 => 'test-successful'
  }

  def self.from_yml(file_path)
    suite_hash = YAML.load_file(file_path)
    suite_hash['file_path'] = file_path
    if File.directory?(subpath = file_path[0..-5])
      suite_hash['subsuites'] = from_yml_dir(subpath)
    end

    new(suite_hash)
  end

  def self.from_yml_dir(dir_path)
    Dir.glob("#{dir_path}/*.yml").map { |yml_file|
      from_yml(yml_file)
    }.sort
  end

  attr_accessor :suite, :section, :specifications, :subsuites, :file_path, :worst

  def initialize(suite_hash)
    unless suite_hash.kind_of?(Hash)
      raise "Expected Hash"
    end
    @suite = suite_hash['suite']
    @section = suite_hash['section']
    @specifications = suite_hash['specifications'].map { |spec|
      Specification.new(spec['description'], spec['test_files'])
    } rescue []
    @subsuites = suite_hash['subsuites'] || []
    @file_path = suite_hash['file_path']
    @worst = 1000
  end

  def <=>(other)
    self.section <=> other.section
  end

  def test_case_dir
    dirs = home_dir.split('/')
    dirs[1] = 'spec_cases'
    dirs.join('/')
  end

  def home_dir
    file_path[0..-5]
  end

  def to_html(colored = false, depth = 1, parent_section = nil)
    title = RDiscount.new(suite).to_html[3..-6]
    numbering = "#{parent_section ? parent_section + '.' : ''}#{section}"

    title_html = "<h#{depth+1}>#{numbering}. #{title}</h#{depth+1}>\n"

    html = ""
    specifications.each do |specification|
      paragraph = RDiscount.new(specification.description).to_html
      if colored
        test_result = specification.test(test_case_dir)
        insert_test_class(paragraph, 2, test_result)
        self.worst = test_result if test_result < self.worst
      end

      html << paragraph
    end

    subsuites.each { |subsuite|
        html << subsuite.to_html(colored, depth + 1, numbering)
        self.worst = subsuite.worst if subsuite.worst < self.worst
    }

    insert_test_class(title_html, 3, self.worst)

    title_html << html
  end

  private
  def insert_test_class(html_code, offset, test_result)
    html_code.insert(
      offset,
      %Q- class="#{COLOR_TABLE[test_result]}"-
    )
  end

end