#!/usr/bin/env ruby

require 'xcodeproj'
require 'set'

project_file, target_name = ARGV
puts "Sorting sources in #{project_file} for target #{target_name}"

project = Xcodeproj::Project.open(project_file)
target = project.targets.select { |t| t.name == target_name }.first

square_framework_run_script_index = target.build_phases.index { |b|
    name = b.name if b.respond_to? :name
    name == "Square Framework Run Script - InAppPaymentsSDK" #name of build phase you have given in plugin below
}
puts "Square Framework Run Script index: #{square_framework_run_script_index} Total build phases: #{target.build_phases.count}"

if square_framework_run_script_index.nil? == false
    puts "Moving Square Framework Run Script from #{square_framework_run_script_index} to the #{target.build_phases.count} index"
    target.build_phases.move_from(square_framework_run_script_index, target.build_phases.count - 1) # move to the last indexs
end

project.save
