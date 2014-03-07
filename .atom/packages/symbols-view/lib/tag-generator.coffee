{BufferedProcess, Point} = require 'atom'
Q = require 'q'
path = require 'path'

module.exports =
class TagGenerator
  constructor: (@path) ->

  parseTagLine: (line) ->
    sections = line.split('\t')
    if sections.length > 3
      position: new Point(parseInt(sections[2]) - 1)
      name: sections[0]
    else
      null

  generate: ->
    deferred = Q.defer()
    tags = []
    command = path.resolve(__dirname, '..', 'vendor', "ctags-#{process.platform}")
    defaultCtagsFile = require.resolve('./.ctags')
    args = ["--options=#{defaultCtagsFile}", '--fields=+KS', '-nf', '-', @path]
    stdout = (lines) =>
      for line in lines.split('\n')
        tag = @parseTagLine(line)
        tags.push(tag) if tag
    exit = ->
      deferred.resolve(tags)

    new BufferedProcess({command, args, stdout, exit})

    deferred.promise
