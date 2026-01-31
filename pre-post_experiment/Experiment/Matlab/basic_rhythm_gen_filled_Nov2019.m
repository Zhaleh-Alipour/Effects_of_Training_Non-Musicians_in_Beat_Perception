%% Make filled-tone rhythm .wav files
%   Original created 28 Nov 2016 (Dan Cameron).
%   Adapted Fall 2019
%   Josh Hoddinott

%%  Instruction %%

%   Create sine-wave rhythms listed in a text file. 
%   Text files should indicate interval ratios (i.e., 1,2,3, or 4) in the
%   order appearing in the rhythm. 
%   Delimit intervals with TAB. 
%   Denote NM intervals as integer-ratios in text file. 
%   Save a separate text file for each rhythmic condition (MS.txt, MC.txt).
%   Each rhythm in the text file should take up one line. 
%   If using inconsistent numbers of intervals, add 0's to the end so each
%   line is consistent length. 

%%  User-defined options: Change as necessary. 

freqs = 500;                        %   Tone frequency (pitch), in Hz
rise_fall_time = .008;              %   Linear rise and fall time of each sound, in s.
sampleFreq = 44100;                 %   Sampling frequency (Hz).
dt = 1/sampleFreq;                  %   Sample steps.
sil = .040;                         %   Duration of silence following tone, in s
sil_fill = sil*sampleFreq;          %   Silent gap in samples.
intlengths = [.250, .270];          %   All base intervals, the minimum IOI, in seconds
amplitude = .5;                     %   Amplitude of the tones, essentially volume
downBeat = 1;                       %   1 = rhythm ends on downBeat, 0 = rhythm ends as written in .txt. 
intnames = '1234';                  %   Names of each unique interval, for filename.
outPrefix = {'ms', 'mc', 'nm'};     %   Condition prefixes for output files.
inPrefix = {'MS', 'MC', 'NM'};      %   Text file prefixes.
condIntervals = {[1,2,3,4]; ...     %   Interval ratios for each condition.
                [1,2,3,4]; ...
                [1,1.4,3.5,4.5]};    
%
plotWavs = 0;
%   NB: outPrefixes 'nm' will automatically use non-integer ratio intervals
%   NB: outPrefix and inPrefixes should match in length and order. 

%%  Load text file.

for z = 1:length(outPrefix)
        if isfile(strcat(inPrefix{z}, '.txt'))          %   Check if txt file exists, and continue if it does.
            wantint = load(strcat(inPrefix{z},'.txt')); %   Load the file. 
            condi = outPrefix{z};
            
            %%   Get durations for each unique interval.
            for q = 1:length(intlengths);                                   %   Loop through tempi.
                
                intervals = [(condIntervals{z}(1)*intlengths(q)-sil), ...   %   Calculate length of each unique interval.
                            (condIntervals{z}(2)*intlengths(q)-sil), ...
                            (condIntervals{z}(3)*intlengths(q)-sil), ...
                            (condIntervals{z}(4)*intlengths(q)-sil)];
                        
                %%  Create tones with sine waves. 
                
                for i = 1:length(intervals);                                
                    t = [0:dt:intervals(i)];                                            %   Get number of samples needed for each tone duration.
                    tone_dur = sin(2*pi*freqs*t);                                       %   Make sine wave for tone duration.
                    
                    %   Make onset/offset ramps, attach them to each tone.
                    tone_rise = linspace(0,1,round(rise_fall_time*sampleFreq)).*tone_dur(1:round(rise_fall_time*sampleFreq));           %   Onset. 
                    tone_fall = linspace(1,0,round(rise_fall_time*sampleFreq)).*tone_dur(end-round(rise_fall_time*sampleFreq)+1:end);   %   Offset.   
                    tone_full = tone_dur(1:(length(tone_dur)-2*length(tone_rise)));     %   Remove length of ramps, maintaining duration.  
%                     tone_full2 = tone_dur(1:(length(tone_dur)-2*tone_rise));          %   Remove length of ramps, maintaining duration.  
                    wavint{i} = [tone_rise, tone_full , tone_fall];                     %   Combine onset/offset ramps with tones.
                    wavint{i} = wavint{i}.*amplitude;                                   %   Set sine wave amplitude.
                end
                
                if plotWavs
                    figure; subplot(4,1,1); plot(tone_dur); title('Tone Duration');
                    subplot(4,1,2); plot(tone_rise);    title('Onset Ramp');
                    subplot(4,1,3); plot(tone_fall);    title('Offset Ramp');
                    subplot(4,1,4); plot(wavint{1});    title('Combined Tone');
                end
                
                %% Make each rhythm from the .txt file
                
                for i = 1:size(wantint, 1);                                                 %   For each rhythm.
                    stim = [];                                                              %   Clear sound.
                    iname = '';                                                             %   Clear output wav filename.
                    for j = 1:size(wantint, 2);                                             %   For each interval in the rhythm.
                        no_we_actually_want = wantint(i,j);                                 %   The interval in the rhythm file (e.g., 1 to 4)
                        if no_we_actually_want >0 ;
                            iname = [iname '_' intnames(no_we_actually_want)];              %   Add this interval to the filename
                            stim = [stim; wavint{no_we_actually_want}'; zeros(sil_fill,1)]; %   Add this interval--tone plus silence--to the soundfile
                        end
                    end
                    if downBeat                                                             %   Add downbeat if specified. 
                    stim = [stim; wavint{1}'];
                    end
                    rhythm = stim;                                                          %   Allocate to rhythm variable. 
                    
                    %% Save
                    
                    save_name = [condi iname '_unit' num2str(intlengths(q)*1000) '.wav']; %    Named by condition, intervals, tempo.
                    audiowrite(save_name,rhythm,sampleFreq);                              %    Write the .wav file, as a single rhythm.
                    
                end
            end
        end
end




%%  Old code.
                    %% For a repeated rhythm:
                    % omit the above [wavwrite...] line, and line 48 (stim = [stim; y];)
                    % and use the following two lines instead. As is, it repeats 4
                    % times. Change as you like..., and can add a final tone, etc.
                    
                    %    rhythm_concat = [rhythm; rhythm; rhythm; rhythm];
                    %    wavwrite(rhythm_concat,fs,save_name);
                    

