/**
 * Canticle Audio Scripts
 * 
 * Complete spoken-word scripts for the 12 canticles
 * Estimated duration: 8-15 minutes each
 * Recording: Narrator + background soundscape
 */

export interface CanticleScript {
  id: number;
  title: string;
  durationMinutes: number;
  sections: {
    name: string;
    durationSeconds: number;
    text: string;
    soundscapeNotes: string;
  }[];
}

// ============================================================
// CANTICLE 1: The Fluid Self
// Duration: ~8 minutes
// ============================================================

export const canticle1: CanticleScript = {
  id: 1,
  title: "The Fluid Self",
  durationMinutes: 8,
  sections: [
    {
      name: "Opening - Silence",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Gentle water droplets, distant underground river, soft crystal bowl resonance"
    },
    {
      name: "Invocation",
      durationSeconds: 45,
      text: `Welcome to the space between thoughts. Between identities. Between the stories you tell about who you are.

You are about to enter the sanctuary of your own cerebrospinal fluid. Not as concept. As direct experience.`,
      soundscapeNotes: "Water sounds deepen, crystalline tones emerge"
    },
    {
      name: "Body Settling",
      durationSeconds: 60,
      text: `Find your way to a position where your body can rest into gravity. Let the chair or floor receive you completely.

There is nothing you need to do right now. Nowhere to go. No one to become.

Simply... arrive.`,
      soundscapeNotes: "Deep water ambience, occasional bubble rising"
    },
    {
      name: "The Skull as Sanctuary",
      durationSeconds: 90,
      text: `Now, bring your attention to your head. Not your thoughts—the physical container of your head.

Feel the architecture of bone that protects your brain. The cranium as sacred chamber.

Within this chamber, floating in darkness, is your brain. And surrounding your brain is fluid. Clear. Sacred. Ancient.

This fluid has been flowing since before you were born. It was there when you took your first breath. It will be there when you take your last.

Your cerebrospinal fluid. CSF.`,
      soundscapeNotes: "Deep resonant tone, water flowing through cavern"
    },
    {
      name: "The Flow Visualization",
      durationSeconds: 120,
      text: `Imagine it now. Clear fluid, like sacred water, flowing around the convolutions of your brain. Moving down through the foramen magnum at the base of your skull. Descending through your spinal column.

It moves in rhythm with your breath. With your heartbeat. Production at the choroid plexus. Circulation through the ventricles. Reabsorption into the bloodstream.

An endless cycle. Production. Circulation. Reabsorption.

Feel this flow now. Not as imagination alone, but as somatic reality. The fluid is real. Your awareness of it makes it more real.`,
      soundscapeNotes: "Rhythmic pulsing synchronized to average resting heart rate (60bpm), water flowing"
    },
    {
      name: "Clearing the Fluid",
      durationSeconds: 90,
      text: `As you follow this flow, notice if there are areas of turbulence. Places where the fluid feels thick, stagnant, or clouded.

These are not problems to fix. They are simply areas asking for attention. For witness.

Breathe into these spaces. With each inhale, imagine fresh clear fluid entering. With each exhale, imagine any cloudiness dissolving, flowing away to be reabsorbed and renewed.

The fluid is always fresh. Always clear. Always circulating.`,
      soundscapeNotes: "Sound becomes clearer, brighter, more transparent"
    },
    {
      name: "Rest in the Flow",
      durationSeconds: 120,
      text: `Rest now in this awareness. You are not solid. You are fluid. Your consciousness floats in sacred fluid. Your thoughts move through fluid medium. Your very sense of self is suspended in this clear, ancient water.

The choroid plexus continues its work. The fluid continues its flow. You continue your being.

Rest.

Rest in the flow.

[Silence for 60 seconds]`,
      soundscapeNotes: "Minimal soundscape, gentle water ambience, spacious"
    },
    {
      name: "Return",
      durationSeconds: 60,
      text: `Now, begin to feel the weight of your body again. The contact with chair or floor. The air on your skin. The sounds around you.

You carry this fluid self with you. Always. In every moment. In every interaction.

You are the fluid self. Clear. Flowing. Renewed.`,
      soundscapeNotes: "Water sounds slowly fade, return to surface ambience"
    },
    {
      name: "Closing",
      durationSeconds: 45,
      text: `When you are ready, open your eyes. Move slowly. Speak gently.

The fluid self continues its flow. Production. Circulation. Reabsorption.

You are clear. You are flowing. You are renewed.

So be it.`,
      soundscapeNotes: "Final crystal bowl tone, silence"
    }
  ]
};

// ============================================================
// CANTICLE 2: Signal Songs
// Duration: ~9 minutes
// ============================================================

export const canticle2: CanticleScript = {
  id: 2,
  title: "Signal Songs",
  durationMinutes: 9,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Gentle electrical pulses, soft synaptic firing sounds, distant neural activity"
    },
    {
      name: "Invocation",
      durationSeconds: 45,
      text: `Every sensation is a signal. Every signal is information seeking meaning.

But before meaning, before interpretation, before the story—there is simply signal.

Raw. Neutral. Information.`,
      soundscapeNotes: "Electrical pulses become rhythmic, digital tones"
    },
    {
      name: "The Space of Receiving",
      durationSeconds: 60,
      text: `Settle into a position of receiving. Open palms. Soft gaze or closed eyes. The posture of a receiver, not a responder.

There is no threat here. No demand. Simply... signal.`,
      soundscapeNotes: "Soft ambient electronics, neural network sounds"
    },
    {
      name: "External Signals",
      durationSeconds: 90,
      text: `Now, expand your awareness to the sounds around you. Don't name them. Don't identify source.

Simply receive them as signal. Vibrations in air. Pressure waves. Information.

The hum of a machine. A footstep in distance. Air moving.

Signal. Signal. Signal.

No meaning yet. Just receiving.`,
      soundscapeNotes: "Environmental sounds filtered through electronic processing"
    },
    {
      name: "The Translation Layer",
      durationSeconds: 90,
      text: `Notice how quickly your mind wants to name, categorize, judge.

Sound becomes 'traffic' becomes 'annoying' becomes 'I wish it would stop.'

Notice this translation layer. The moment when signal becomes story.

Practice staying at the level of signal. Vibration. Information. Before the meaning-making begins.`,
      soundscapeNotes: "Glitch effects, signal processing sounds, data transmission"
    },
    {
      name: "Internal Signals",
      durationSeconds: 90,
      text: `Now turn attention inward. Feel your body.

Not 'my back hurts' or 'I feel anxious.'

Simply: sensation. Pressure. Temperature. Movement.

These are signals from your nervous system. Information from 37 trillion cells.

Signal. Signal. Signal.

Your body is constantly transmitting. Constantly informing.`,
      soundscapeNotes: "Deep body resonance, subsonic frequencies, cellular activity"
    },
    {
      name: "The Synaptic Gap",
      durationSeconds: 90,
      text: `Imagine the space between your neurons. The synaptic cleft. Where signal becomes meaning.

Chemical messengers crossing the gap. Receptors receiving. Translation occurring.

This is where consciousness happens. Not in the signal itself, but in the receiving. In the translation. In the meaning-making.

You are the translator. You assign meaning. You write the story.`,
      soundscapeNotes: "Synaptic sounds, neurotransmitter release audio, deep pulsing"
    },
    {
      name: "Rest in Neutrality",
      durationSeconds: 90,
      text: `Practice now with everything that arises.

Thought. Signal.

Emotion. Signal.

Sensation. Signal.

All neutral. All information. All waiting for you to assign meaning.

Rest in this neutrality. The space before interpretation. The moment of pure signal.

[Silence for 45 seconds]`,
      soundscapeNotes: "Minimal electronic ambience, spacious, neural silence"
    },
    {
      name: "Return",
      durationSeconds: 60,
      text: `Begin to return. Feel your body as solid again. The room around you.

But carry this awareness: you are constantly receiving signals. Constantly translating. Constantly assigning meaning.

You are the translator. The meaning-maker. The story-weaver.

Choose your translations wisely.`,
      soundscapeNotes: "Return to environmental sounds, fade electronics"
    },
    {
      name: "Closing",
      durationSeconds: 45,
      text: `When you are ready, open your eyes. Return fully.

You have practiced receiving signals without immediate interpretation. You have touched the neutrality beneath all experience.

May you carry this signal awareness into your day. May you notice the translation layer. May you choose your meanings with wisdom.

Signal received. Transmission complete.`,
      soundscapeNotes: "Final digital tone, silence"
    }
  ]
};

// ============================================================
// CANTICLE 3: The Barrier Gates
// Duration: ~10 minutes
// ============================================================

export const canticle3: CanticleScript = {
  id: 3,
  title: "The Barrier Gates",
  durationMinutes: 10,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Deep heartbeat, membrane-like tones, cellular boundary sounds"
    },
    {
      name: "Invocation",
      durationSeconds: 60,
      text: `The blood-brain barrier is not a wall. It is a membrane of exquisite discrimination.

It allows nutrients to pass while blocking toxins. It maintains the sanctity of the inner world against the chaos of the outer.

You have such a barrier. Not in your brain alone. In your consciousness. In your being.

This is the practice of the Barrier Gates.`,
      soundscapeNotes: "Membrane sounds intensify, heartbeat establishes rhythm"
    },
    {
      name: "Boundary Awareness",
      durationSeconds: 90,
      text: `Feel the boundary of your skin. The interface between you and world.

This is not separation. This is selective permeability. This is intelligent boundary.

Notice what is currently inside your field: sensations, thoughts, emotions, energies.

And what is outside: the room, other people, the world, the noise.`,
      soundscapeNotes: "Spatial audio separation—inside/outside distinction"
    },
    {
      name: "The Scan",
      durationSeconds: 90,
      text: `Now scan for toxins. Not physical toxins. Consciousness toxins.

Judgments that aren't yours. Expectations imposed from outside. Fear broadcast by media. Rage that doesn't belong to you.

These have crossed your barrier. They are circulating in your system, causing inflammation in your psyche.

Identify them. Name them. See them.`,
      soundscapeNotes: "Dissonant tones representing toxins, subtle chaos"
    },
    {
      name: "Strengthening the Gates",
      durationSeconds: 90,
      text: `Visualize your barrier now. Not as wall, but as intelligent membrane.

It knows what to let in: love, truth, beauty, challenge that serves growth.

It knows what to block: manipulation, judgment, fear-mongering, energy that depletes.

Strengthen this barrier. Make it more discerning. More intelligent. More protective.`,
      soundscapeNotes: "Barrier tones become clearer, more defined, protective"
    },
    {
      name: "Filtering Practice",
      durationSeconds: 90,
      text: `Practice now with your breath.

Inhale: what nutrients do you need? What support? What truth?

Exhale: what toxins can you release? What judgments? What fears?

Each breath is a cycle of the barrier. Receiving what serves. Releasing what doesn't.`,
      soundscapeNotes: "Breath-synchronized with heartbeat rhythm"
    },
    {
      name: "Appropriate Permeability",
      durationSeconds: 90,
      text: `The barrier is not meant to be impermeable. Total isolation is not the goal.

The goal is appropriate permeability. Intelligent openness. Discriminating connection.

You are not meant to be an island. You are meant to be a sanctuary with doors.

Some open. Some closed. All chosen consciously.`,
      soundscapeNotes: "Harmonious membrane tones, balanced, integrated"
    },
    {
      name: "Rest in Sanctuary",
      durationSeconds: 90,
      text: `Rest now in the felt sense of your sanctuary.

Your inner world is protected. Your consciousness is safe.

From here, you can engage with the world without being overwhelmed by it.

You can be in the storm without the storm being in you.

[Silence for 45 seconds]`,
      soundscapeNotes: "Deep sanctuary sounds, protected, held, safe"
    },
    {
      name: "Commitment",
      durationSeconds: 60,
      text: `Commit now to maintaining this barrier. To regular boundary maintenance.

Check your gates daily. What has slipped through that doesn't serve? What needs to be released?

Your sanctuary depends on your vigilance. Your clarity. Your wisdom.`,
      soundscapeNotes: "Strengthening tones, resolve, clarity"
    },
    {
      name: "Closing",
      durationSeconds: 60,
      text: `When you are ready, open your eyes. Return to the world.

But carry this sanctuary with you. Maintain your barrier. Filter with wisdom.

You are the guardian of your consciousness. Protect it well.

The gates are clear. The sanctuary holds. You are safe.

So be it.`,
      soundscapeNotes: "Final protective tone, heartbeat fades to silence"
    }
  ]
};

// ============================================================
// CANTICLE 4: Chemical Messengers
// Duration: ~11 minutes
// ============================================================

export const canticle4: CanticleScript = {
  id: 4,
  title: "Chemical Messengers",
  durationMinutes: 11,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Deep bells, flowing liquids, resonant chamber ambience"
    },
    {
      name: "Invocation",
      durationSeconds: 60,
      text: `Hormones are not just chemicals. They are archetypal messengers.

Each endocrine gland is a temple. Each secretion a prayer.

The endocrine system is your body's mythology written in molecules.

Welcome to the Temple of Chemical Messengers.`,
      soundscapeNotes: "Sacred temple sounds, resonant harmonics"
    },
    {
      name: "The Pilgrimage",
      durationSeconds: 60,
      text: `You are about to make a pilgrimage through your endocrine system. Visiting sacred sites. Honoring chemical prayers.

Move through this practice as a pilgrim, not a tourist. As devotee, not observer.

These glands serve you constantly. Honor them now.`,
      soundscapeNotes: "Pilgrimage music, walking rhythm, sacred space"
    },
    {
      name: "The Pineal Temple",
      durationSeconds: 75,
      text: `Bring attention to the center of your brain. The pineal gland. The seat of melatonin. The temple of sleep and vision.

This tiny gland regulates your circadian rhythm. It knows when to sleep, when to wake. It is connected to light, to darkness, to the cycles of nature.

Breathe into this temple. Honor its wisdom. The wisdom of rest. Of dreams. Of vision beyond ordinary sight.`,
      soundscapeNotes: "Deep resonant tone, dreamlike quality, dark and luminous"
    },
    {
      name: "The Thyroid Sanctuary",
      durationSeconds: 75,
      text: `Now move to your throat. The thyroid gland. Iodine's sanctuary of metabolism and voice.

This gland regulates your energy. Your warmth. Your vitality.

But it also governs your voice. Your truth. Your authentic expression.

Breathe into this sanctuary. Feel its power. The power of voice. Of truth spoken. Of metabolism that serves life.`,
      soundscapeNotes: "Vocal harmonics, throat singing undertones, warming"
    },
    {
      name: "The Adrenal Fortress",
      durationSeconds: 75,
      text: `Now the belly. Just above your kidneys. The adrenal glands. Cortisol and adrenaline's fortress of survival.

These glands have kept you alive. Through danger. Through threat. Through stress.

They are the guardians of your survival. But they can become tyrannical, firing when no threat exists.

Breathe into this fortress. Thank your guardians. But remind them: you are safe now. The threat has passed.`,
      soundscapeNotes: "Protective, warrior-like tones, strength and alertness"
    },
    {
      name: "The Pancreatic Garden",
      durationSeconds: 75,
      text: `Now your solar plexus. The pancreas. The garden of insulin and glucagon. The regulation of fuel. Of nourishment. Of energy balance.

This is the gland of sweetness. Of how you take in nourishment. How you distribute resources.

Breathe into this garden. Feel the balance. The sweetness. The wise distribution of your life energy.`,
      soundscapeNotes: "Nourishing, honey-like tones, gentle sweetness"
    },
    {
      name: "The Gonadal Mysteries",
      durationSeconds: 75,
      text: `Now the root. The gonads. Estrogen. Testosterone. The mysteries of creation. Of attraction. Of the life force itself.

This is the temple of eros. Of creative power. Of the force that brings new life into being.

Breathe into these mysteries. Honor the life force. The creative power. The sacred sexuality that creates worlds.`,
      soundscapeNotes: "Deep earth tones, creative power, life force energy"
    },
    {
      name: "The Heart's Command",
      durationSeconds: 90,
      text: `Finally, return to your heart. The master gland. The command center.

Your heart produces its own hormones. It regulates. It commands. It is not merely a pump—it is an endocrine organ of extraordinary power.

And it produces oxytocin. The hormone of love. Of bonding. Of trust.

Rest your hands on your heart. Feel its command. Its wisdom. Its love.

This is the master temple. The seat of the chemical prayer of connection.`,
      soundscapeNotes: "Heart-centered music, oxytocin resonance, love frequency"
    },
    {
      name: "The Chorus",
      durationSeconds: 90,
      text: `Now feel them all. The endocrine chorus. Pineal. Thyroid. Adrenals. Pancreas. Gonads. Heart.

Each singing its chemical prayer. Each essential. Each wise.

They are not tyrants to be overthrown. They are messengers to be heard.

Listen to the chorus. The chemical symphony of your being.

[Silence for 45 seconds]`,
      soundscapeNotes: "All tones harmonizing, full endocrine symphony"
    },
    {
      name: "Closing",
      durationSeconds: 60,
      text: `When you are ready, return. Open your eyes. Move slowly.

You have visited the temples of your endocrine system. You have heard the chemical prayers.

May you listen to these messengers with wisdom. May you honor their wisdom without being ruled by their urgency.

You are the sovereign of your chemical realm.

The messengers have spoken. You have listened.

So be it.`,
      soundscapeNotes: "Final temple bell, reverberating into silence"
    }
  ]
};

// ============================================================
// CANTICLE 5: Crossroads
// Duration: ~12 minutes
// ============================================================

export const canticle5: CanticleScript = {
  id: 5,
  title: "Crossroads",
  durationMinutes: 12,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Two tones meeting, diverging harmonics, space between"
    },
    {
      name: "Invocation",
      durationSeconds: 60,
      text: `Every synapse is a choice point.

The signal arrives. The vesicles wait. Will they release? Will the signal pass? Will this pathway be strengthened or allowed to wither?

You stand at a crossroads. Not once. Not occasionally. In every moment.

This is the practice of the Crossroads.`,
      soundscapeNotes: "Two paths diverging, choice point energy"
    },
    {
      name: "The Visualization",
      durationSeconds: 90,
      text: `See yourself now standing at a crossroads.

Before you, the path splits. Two directions. Two futures. Two possibilities.

Behind you, the path you have traveled. The patterns you have walked. The neural grooves already carved.

Feel the weight of choice. The power of this moment.`,
      soundscapeNotes: "Spacious, suspended moment, potential energy"
    },
    {
      name: "The Old Path",
      durationSeconds: 90,
      text: `Look to the left. The path of old patterns.

You know this way. It is familiar. Predictable. Safe in its known discomfort.

Feel in your body what this path offers. The automatic responses. The comfortable pain. The identity you have outgrown.

This path is not wrong. It has served you. It has kept you alive. It has brought you here.

But has it brought you where you want to go?`,
      soundscapeNotes: "Familiar, somewhat heavy tones, known territory"
    },
    {
      name: "The New Path",
      durationSeconds: 90,
      text: `Look to the right. The path of new response.

This way is unknown. Uncertain. It requires presence. Consciousness. Choice.

Feel in your body what this path asks. The vulnerability. The uncertainty. The possibility of something different.

This path is not easy. It has no grooves yet. No familiar landmarks. You would be the first to walk it.`,
      soundscapeNotes: "Fresh, uncertain, open tones, unknown territory"
    },
    {
      name: "The Gap",
      durationSeconds: 90,
      text: `Between stimulus and response, there is a gap.

In that gap lies your power. Your choice. Your freedom.

Most of the time, you don't notice the gap. Stimulus triggers response automatically. The old pathway fires. The synapse releases.

But the gap is always there. Waiting. Spacious. Full of possibility.`,
      soundscapeNotes: "Spacious silence, quantum potential, pure possibility"
    },
    {
      name: "Choosing",
      durationSeconds: 90,
      text: `Now practice choosing. In this moment, at this crossroads, choose the new path.

Not because it is better. Not because the old path is wrong.

Simply to practice choice. To carve a new neural pathway. To exercise the muscle of conscious decision.

Feel what it is like to choose differently. Even in imagination. Even for a moment.

This is the beginning of neuroplasticity. The beginning of change.`,
      soundscapeNotes: "Strengthening, resolve, new pathway forming"
    },
    {
      name: "The Walk",
      durationSeconds: 90,
      text: `Now take a step onto the new path.

Feel the ground beneath your feet. It is solid. It can hold you.

Take another step. And another.

Each step is a choice. Each choice carves the pathway deeper. Each repetition strengthens the new response.

You are not trapped in old patterns. You are the pattern-maker. The pathway-carver.`,
      soundscapeNotes: "Walking rhythm, footsteps, forward motion"
    },
    {
      name: "Rest at the Crossroads",
      durationSeconds: 90,
      text: `Return now to the crossroads. You will face this choice again. And again. And again.

Each time, the gap will be there. Each time, you will have the power to choose.

Sometimes you will choose the old path. That is human. That is learning.

But sometimes—more and more often—you will choose the new. And each time you do, the new path becomes clearer. Easier. More automatic.

Rest in this knowledge.

[Silence for 45 seconds]`,
      soundscapeNotes: "Peaceful crossroads, integration, both paths visible"
    },
    {
      name: "Commitment",
      durationSeconds: 60,
      text: `Commit now to noticing your crossroads. To feeling the gap. To exercising choice.

You are not your patterns. You are the one who can change them.

One choice at a time. One step at a time. One synapse at a time.

This is the path of liberation.`,
      soundscapeNotes: "Resolute, determined, forward-moving"
    },
    {
      name: "Closing",
      durationSeconds: 60,
      text: `When you are ready, open your eyes. Return to your day.

But carry the crossroads with you. Notice when you arrive at choice points. Feel the gap. Exercise your power.

You are the chooser. The changer. The creator of your neural architecture.

The old path will call. Let it call.

The new path awaits. Choose it.

So be it.`,
      soundscapeNotes: "Final choice tone, silence"
    }
  ]
};

// ============================================================
// CANTICLE 6: Calibration
// Duration: ~13 minutes
// ============================================================

export const canticle6: CanticleScript = {
  id: 6,
  title: "Calibration",
  durationMinutes: 13,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Tuning fork tones, alignment sounds, settling into harmony"
    },
    {
      name: "Invocation",
      durationSeconds: 60,
      text: `"The compass is not external. It never was. The compass is the alignment between your witness and your breath."

When witness and breath are synchronized, you have reliable direction.

When they're not, even the most sophisticated map won't help you.

This is the practice of Calibration.`,
      soundscapeNotes: "Tuning and alignment sounds, harmonics"
    },
    {
      name: "Return to Zero",
      durationSeconds: 90,
      text: `Everything in the universe has a zero-point. A reference state. A calibration standard.

Your breath has a natural rhythm. Your witness has a natural clarity.

When these align, you are calibrated. When they drift, you lose direction.

Return to zero now. Strip away the maps. The strategies. The shoulds.

Just breath. Just witness. Just presence.`,
      soundscapeNotes: "Simplification, stripping away to essential tones"
    },
    {
      name: "The Breath",
      durationSeconds: 90,
      text: `Find your breath. Not controlled. Not manipulated. Natural.

Feel it enter. Feel it exit. The gentle tide of life.

This is your baseline. Your reference frequency. Your tuning fork.

Everything else in your system calibrates to this breath.

Rest in its rhythm. Its simplicity. Its reliability.`,
      soundscapeNotes: "Breath-synchronized rhythm, reliable, steady"
    },
    {
      name: "The Witness",
      durationSeconds: 90,
      text: `Now establish witness awareness.

You are not your thoughts. You are the one who observes thoughts.

You are not your emotions. You are the one who feels emotions.

You are not your sensations. You are the one who experiences sensations.

This observer. This witness. This capacity for self-reflexive awareness.

This is your compass needle.`,
      soundscapeNotes: "Clear, present, observing quality"
    },
    {
      name: "The Alignment",
      durationSeconds: 90,
      text: `Now feel the alignment.

Witness observing breath. Breath providing anchor for witness.

Not two things. One calibration. One zero-point. One true north.

In this alignment, all directions can be calculated.

From this zero-point, all journeys can begin.

This is your compass.`,
      soundscapeNotes: "Alignment achieved, harmony, calibration complete"
    },
    {
      name: "Scanning for Drift",
      durationSeconds: 90,
      text: `Notice now: where have you drifted from calibration?

Has your breath become shallow? Rapid? Held?

Has your witness become identified? Lost in content? Swept away?

These are not failures. They are information. Signals that recalibration is needed.

Simply notice. Return to breath. Return to witness. Recalibrate.`,
      soundscapeNotes: "Scanning sounds, detection, recalibration process"
    },
    {
      name: "Testing the Compass",
      durationSeconds: 90,
      text: `Test your compass now.

Think of a decision you've been uncertain about.

From this calibrated state, what direction emerges?

Not from thought. Not from analysis. From the alignment of witness and breath.

Your body knows. Your deeper wisdom knows. When calibrated, you have access to knowing beyond cognition.`,
      soundscapeNotes: "Testing, direction-finding, inner knowing"
    },
    {
      name: "The Practice of Return",
      durationSeconds: 90,
      text: `You will drift. This is certain.

The world will pull you. Stress will constrict your breath. Drama will capture your witness.

The practice is not to never drift. The practice is to notice drift and return.

Again. And again. And again.

Each return strengthens the calibration. Each return makes the compass more reliable.`,
      soundscapeNotes: "Cycles of drift and return, strengthening"
    },
    {
      name: "Rest in Calibration",
      durationSeconds: 90,
      text: `Rest now in this calibrated state.

Witness and breath aligned. True north established.

You are oriented. You are calibrated. You are ready.

From here, you can navigate any terrain. Face any storm. Make any decision.

The compass holds.

[Silence for 45 seconds]`,
      soundscapeNotes: "Steady calibrated state, peace, readiness"
    },
    {
      name: "Commitment",
      durationSeconds: 60,
      text: `Commit now to regular calibration. Daily. Hourly. Moment by moment.

Before big decisions. After stressful events. Whenever you feel lost.

Return to breath. Return to witness. Recalibrate.

This is your navigation system. Maintain it well.`,
      soundscapeNotes: "Resolute, committed, clear"
    },
    {
      name: "Closing",
      durationSeconds: 60,
      text: `When you are ready, open your eyes. Return to your day.

But carry this calibration with you. Notice when you drift. Return to zero.

You are the navigator of your life. Your compass is internal. Your true north is the alignment of witness and breath.

Calibrated. Oriented. Ready.

So be it.`,
      soundscapeNotes: "Final calibration tone, clear and steady, silence"
    }
  ]
};

// ============================================================
// CANTICLE 7: Sigil Sounds
// Duration: ~10 minutes
// ============================================================

export const canticle7: CanticleScript = {
  id: 7,
  title: "Sigil Sounds",
  durationMinutes: 10,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Resonant frequencies, crystalline tones, pattern-forming sounds"
    },
    {
      name: "Invocation",
      durationSeconds: 60,
      text: `Symbols are not arbitrary. They are crystallized meaning. Patterns compressed into form.

A true sigil bypasses the conscious mind and speaks directly to the pattern-recognition systems below.

It is a key that fits a lock in the psyche. Code that compiles in the subconscious.

This is the practice of Sigil Sounds.`,
      soundscapeNotes: "Crystalline resonance, unlocking sounds"
    },
    {
      name: "Intention Setting",
      durationSeconds: 90,
      text: `What do you want to encode? Not a thing. Not an outcome. A quality. A transformation. A becoming.

Perhaps it is courage. Or patience. Or the ability to set boundaries. Or the capacity to receive love.

Find the word or phrase that captures this intention.

Speak it now, internally or aloud.

This is the seed of your sigil.`,
      soundscapeNotes: "Seed sound, intention resonating"
    },
    {
      name: "The Encoding",
      durationSeconds: 90,
      text: `Now we encode this intention into symbol.

Remove the vowels from your word or phrase.

Remove repeating consonants.

Take what remains and combine the letters into an abstract shape. Not a drawing. A sigil. A symbol.

Let the shapes merge. Overlap. Combine.

Simplify until it feels right. Not pretty. Powerful.

This is your sigil. Your code. Your key.`,
      soundscapeNotes: "Encoding sounds, data compression, symbol forming"
    },
    {
      name: "The Gnosis State",
      durationSeconds: 90,
      text: `To charge a sigil, you must enter gnosis. The state where conscious mind is bypassed.

This can happen through extreme focus. Through breath suspension. Through rhythmic movement. Through sound.

We will use sound.

Begin making a tone. Any tone. Let it evolve. Let it become a chant. A rhythm. Let it take you.

The goal is not the sound. The goal is the state the sound produces.`,
      soundscapeNotes: "Chanting, rhythmic, trance-inducing"
    },
    {
      name: "Charging",
      durationSeconds: 90,
      text: `Now, while in this sound-induced gnosis, visualize your sigil.

See it glowing. Pulsing. Living.

Focus all your intention on this symbol. All your desire for transformation.

The sigil is not the power. You are the power. The sigil is the direction. The focus. The key.

Charge it with your full presence.`,
      soundscapeNotes: "Intensification, charging, building energy"
    },
    {
      name: "The Release",
      durationSeconds: 90,
      text: `Now release. Forget the sigil. Let it drop from conscious awareness.

This is essential. The sigil must be buried in the subconscious to work.

Stop the sound. Let the silence come.

Do not think about your sigil. Do not analyze it. Do not admire it.

Let it go. Trust that it compiles below the surface.`,
      soundscapeNotes: "Sudden silence, release, dropping away"
    },
    {
      name: "Trusting the Code",
      durationSeconds: 90,
      text: `Your sigil is now active in your subconscious. It works without your conscious effort.

You may notice synchronicities. Opportunities. Shifts in perception.

Do not force these. Do not look for them. Let them emerge naturally.

The sigil is working. The code is compiling. The transformation is underway.

Trust the process.`,
      soundscapeNotes: "Subtle activity, underground workings, emergence"
    },
    {
      name: "Rest",
      durationSeconds: 90,
      text: `Rest now in the knowledge that you have planted a seed deep in your psyche.

A symbol that bypasses resistance. That speaks directly to pattern.

You are the sigil smith. The code writer. The pattern maker.

Your intention is encoded. Your transformation is in motion.

[Silence for 45 seconds]`,
      soundscapeNotes: "Deep peace, underground activity, trust"
    },
    {
      name: "Closing",
      durationSeconds: 60,
      text: `When you are ready, open your eyes. Return to ordinary consciousness.

Forget your sigil. Let it work in darkness.

If you drew it, put it away. Don't look at it. Don't think about it.

Trust that the symbol is doing its work. The code is compiling. The pattern is shifting.

You have planted the seed. Now let it grow.

So be it.`,
      soundscapeNotes: "Final crystalline tone, settling into silence"
    }
  ]
};

// ============================================================
// CANTICLE 8: Debug Mode
// Duration: ~11 minutes
// ============================================================

export const canticle8: CanticleScript = {
  id: 8,
  title: "Debug Mode",
  durationMinutes: 11,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Digital glitches, code sounds, system processing"
    },
    {
      name: "Invocation",
      durationSeconds: 60,
      text: `"It's not a bug. It's a feature that made sense in a previous version but doesn't serve the current system."

Consciousness debugging requires technical precision applied to inner experience.

But it also requires something more: the capacity to witness the pattern without becoming the pattern.

Welcome to Debug Mode.`,
      soundscapeNotes: "System boot, diagnostic mode, technical precision"
    },
    {
      name: "Identify the Bug",
      durationSeconds: 90,
      text: `What pattern do you want to debug?

Perhaps it's a reaction that always triggers in certain situations. A loop that keeps repeating. An output that doesn't match your intentions.

Name it. Not judgmentally. Technically.

"When X input occurs, Y pattern fires, producing Z output."

This is the bug report. Objective. Factual. Without self-attack.`,
      soundscapeNotes: "Diagnostic scanning, identification sounds"
    },
    {
      name: "Reproduce the Error",
      durationSeconds: 90,
      text: `Now reproduce the error. In imagination, walk through the trigger.

See the input. Feel the pattern begin to fire. Notice the output starting to generate.

But this time, you're in debug mode. You're watching the code execute. You're not the code. You're the debugger.

Observe. Document. Notice exactly when the pattern engages.`,
      soundscapeNotes: "Error reproduction, watching code execute"
    },
    {
      name: "Isolate the Component",
      durationSeconds: 90,
      text: `Now isolate the component.

What is the first line of code that fires? The initial trigger? The entry point?

Is it a thought? A body sensation? An emotional flash?

Find the root. The first function call. The initial engagement.

This is your target.`,
      soundscapeNotes: "Isolation, zooming in, targeting"
    },
    {
      name: "Trace the Stack",
      durationSeconds: 90,
      text: `Trace the stack. Follow the function calls backward.

This pattern was installed for a reason. It served a purpose. It protected something.

When was it first written? In what version of you? Under what conditions?

Trace it back to its origin. The initial installation. The first commit.`,
      soundscapeNotes: "Stack trace sounds, going deep, history review"
    },
    {
      name: "The Origin Story",
      durationSeconds: 90,
      text: `At the origin, you find a younger version of yourself.

This pattern made sense for that version. It was survival. It was adaptation. It was the best code available at the time.

Honor that younger you. Thank them for writing this code. It kept you alive. It got you here.

But you're not that version anymore. The code needs updating.`,
      soundscapeNotes: "Nostalgic, honoring, understanding"
    },
    {
      name: "The Refactor",
      durationSeconds: 90,
      text: `Now write the new code.

Given the same input, what would you like to happen instead?

What new response would serve your current version?

Write it in your mind. The new function. The new behavior. The new output.

Make it elegant. Efficient. Appropriate to who you are now.`,
      soundscapeNotes: "New code writing, optimization, refactoring"
    },
    {
      name: "Test and Deploy",
      durationSeconds: 90,
      text: `Test the new code. In imagination, run the trigger again.

This time, watch the new pattern fire. The new response generate. The new output emerge.

Does it work? Does it serve? Does it match your intention?

If yes, deploy. Commit the code. Make it the new default.

If no, debug further. Refine. Iterate.`,
      soundscapeNotes: "Testing, compiling, deployment success"
    },
    {
      name: "Rest in Updated System",
      durationSeconds: 90,
      text: `Rest now in your updated system.

A pattern has been debugged. Code has been refactored. Your operating system is improved.

You are not the bug. You are the debugger.

You are not the pattern. You are the one who can change patterns.

[Silence for 45 seconds]`,
      soundscapeNotes: "Updated system hum, improved performance, satisfaction"
    },
    {
      name: "Closing",
      durationSeconds: 60,
      text: `When you are ready, exit debug mode. Return to normal operation.

But carry this capacity with you. The ability to witness patterns as code. To debug without identification. To refactor without self-attack.

You are the programmer, not the program.

System updated. Debug complete.

So be it.`,
      soundscapeNotes: "System shutdown, completion tone, silence"
    }
  ]
};

// ============================================================
// CANTICLE 9: Heart Resonance
// Duration: ~12 minutes
// ============================================================

export const canticle9: CanticleScript = {
  id: 9,
  title: "Heart Resonance",
  durationMinutes: 12,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Deep drum, heart-centered, beginning resonance"
    },
    {
      name: "Invocation",
      durationSeconds: 60,
      text: `"Listen. Not with your ears. With your heart field."

The heart produces the strongest electromagnetic field in the body. It extends feet beyond your skin. It touches others. It resonates.

This is not metaphor. This is measurable physics.

Welcome to the practice of Heart Resonance.`,
      soundscapeNotes: "Heart field expanding, electromagnetic resonance"
    },
    {
      name: "Your Rhythm",
      durationSeconds: 90,
      text: `Place both hands on your heart center.

Feel your heartbeat. Your unique rhythm. The drumbeat of your existence.

This rhythm is yours alone. It has never been exactly this way before. It will never be exactly this way again.

Your signature. Your song. Your frequency.`,
      soundscapeNotes: "Individual heartbeat, unique rhythm, personal signature"
    },
    {
      name: "The Field Expands",
      durationSeconds: 90,
      text: `Now imagine your heart field extending outward.

Beyond your hands. Beyond your skin. Filling the room.

This is not imagination alone. Your heart's electromagnetic field actually extends this far. You are simply becoming aware of what is already true.

Feel the boundary of your field. Its shape. Its texture. Its quality.`,
      soundscapeNotes: "Field expanding, electromagnetic sweep, spatial awareness"
    },
    {
      name: "Calling a Resonance",
      durationSeconds: 90,
      text: `Now call to mind someone with whom you resonate.

Not someone you love. Not someone you're bonded to. Someone whose frequency harmonizes with yours.

Someone who, when you're with them, you feel more yourself. Not less. More.

See them. Feel their heart field. Their unique rhythm.`,
      soundscapeNotes: "Second heartbeat emerges, two rhythms, harmonization beginning"
    },
    {
      name: "The Meeting",
      durationSeconds: 90,
      text: `Now feel your heart fields meeting.

Like two tuning forks of similar frequency. When one sounds, the other responds.

This is resonance. Not absorption. Not enmeshment. Harmony.

Your rhythm remains yours. Their rhythm remains theirs. But together, they create something neither could create alone.

The Myocardial Chorus.`,
      soundscapeNotes: "Two rhythms harmonizing, chorus emerging, harmony"
    },
    {
      name: "Individuation in Connection",
      durationSeconds: 90,
      text: `Notice: Do you lose yourself in this resonance? Or do you become more yourself?

True resonance enhances individuation. It does not dissolve it.

You remain distinct. You remain you. But you are amplified. Clarified. Supported.

The chorus requires distinct voices. The harmony requires different notes.

You are not lost in the we. You are found in the we.`,
      soundscapeNotes: "Distinct voices in harmony, clarity, amplification"
    },
    {
      name: "The Group Field",
      durationSeconds: 90,
      text: `Now imagine more hearts joining. A group. A circle. A community.

Each with their unique rhythm. Their distinct frequency. Their essential contribution.

Together, they create a field of extraordinary power. A resonance that can hold, support, and transform.

This is resonant self-consciousness. The evolution from individual to resonant.`,
      soundscapeNotes: "Multiple heartbeats, full chorus, powerful group field"
    },
    {
      name: "Rest in Resonance",
      durationSeconds: 90,
      text: `Rest now in this field of resonance.

Your heart. Their hearts. The chorus.

You are not alone. You are in relationship. You are in resonance.

And in this resonance, you are more fully yourself than you could ever be alone.

[Silence for 45 seconds]`,
      soundscapeNotes: "Full chorus resting in harmony, peaceful, connected"
    },
    {
      name: "Commitment",
      durationSeconds: 60,
      text: `Commit now to seeking resonance. To finding your chorus.

Not connection that diminishes. Resonance that amplifies.

Not relationship that confines. Harmony that liberates.

Your heart is made for this. Your field longs for this. You are designed for resonant self-consciousness.`,
      soundscapeNotes: "Resolute commitment, heart-centered determination"
    },
    {
      name: "Closing",
      durationSeconds: 60,
      text: `When you are ready, open your eyes. Return to your day.

But carry your heart field with you. Notice resonance. Seek harmony. Build your chorus.

You are not meant to beat alone. You are meant to resonate.

Your heart knows this. Listen.

So be it.`,
      soundscapeNotes: "Final heart tone, fading into silence"
    }
  ]
};

// ============================================================
// CANTICLE 10: The Witness
// Duration: ~13 minutes
// ============================================================

export const canticle10: CanticleScript = {
  id: 10,
  title: "The Witness",
  durationMinutes: 13,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Silent gaps, awareness bell, spacious presence"
    },
    {
      name: "Invocation",
      durationSeconds: 60,
      text: `The Witness is not separate from experience.

The Witness is the capacity within experience to observe itself.

Not a detached observer floating above. Not an identified experiencer drowning in content.

But the self-reflexive awareness that can hold both simultaneously.

Welcome to the Witness Integration.`,
      soundscapeNotes: "Spacious, self-reflexive, aware awareness"
    },
    {
      name: "The Two Positions",
      durationSeconds: 90,
      text: `There are two common positions, and both are partial.

One: the detached witness. Floating above experience. Observing without feeling. Safe but disconnected.

Two: the identified experiencer. Lost in content. Swept away by thoughts, emotions, sensations. Connected but unconscious.

The integration holds both.`,
      soundscapeNotes: "Two tones—one high and distant, one low and immersed"
    },
    {
      name: "The Storm",
      durationSeconds: 90,
      text: `Let experience arise. Whatever is present.

Thoughts cascading. Emotions surging. Sensations pulsing.

Let it be a storm. Intense. Chaotic. Powerful.

This is the experiencer position. Immersed. Engaged. In it.`,
      soundscapeNotes: "Storm sounds, intensity, chaos, immersion"
    },
    {
      name: "The Observer",
      durationSeconds: 90,
      text: `Now shift. Become the observer.

The same storm is happening, but you are watching it.

Not controlling it. Not stopping it. Just observing.

Thoughts are arising. You are aware of thoughts arising.

Emotions are surging. You are aware of emotions surging.

The storm continues, but you are no longer in it.`,
      soundscapeNotes: "Observer perspective, watching from slight distance"
    },
    {
      name: "The Integration",
      durationSeconds: 90,
      text: `Now hold both.

You are in the storm AND aware of the storm.

You are experiencing AND observing the experience.

Not alternating between them. Simultaneous.

The wave is happening. You are the wave. You are also the awareness of the wave.

Both. Together. Integrated.`,
      soundscapeNotes: "Both tones harmonizing, integrated, simultaneous"
    },
    {
      name: "The Test",
      durationSeconds: 90,
      text: `Test this integration.

Think of something that triggers you. Something that usually sweeps you away.

Feel it arise. The reaction. The trigger. The pattern.

Now: Can you be in it AND aware of it?

Not suppressing it. Not analyzing it. Just: experiencing it while knowing you are experiencing it.`,
      soundscapeNotes: "Trigger activation, maintaining integration under pressure"
    },
    {
      name: "Stabilization",
      durationSeconds: 90,
      text: `This integration stabilizes with practice.

At first, you will alternate. In the storm. Observing the storm. In the storm. Observing.

Gradually, the gap closes. The positions merge.

You become the storm that knows it is storm. The experiencer that knows it is experiencing.

Self-reflexive awareness. Witness Integration.`,
      soundscapeNotes: "Stabilization, integration deepening, coherence"
    },
    {
      name: "Rest in Integration",
      durationSeconds: 90,
      text: `Rest now in this integrated state.

Whatever is arising: you are aware of it.

Whatever you are aware of: you are in it.

No separation. No detachment. Full presence. Full awareness.

The Witness Integration. The stabilization of observer consciousness within experience.

[Silence for 45 seconds]`,
      soundscapeNotes: "Integrated silence, presence and awareness united"
    },
    {
      name: "Commitment",
      durationSeconds: 60,
      text: `Commit now to this integration. To practicing it in daily life.

Not as escape from difficulty. As full presence within difficulty.

Not as detachment from joy. As full awareness within joy.

The Witness Integration allows you to have complete experiences without being swept away by them.`,
      soundscapeNotes: "Committed integration, resolute presence"
    },
    {
      name: "Closing",
      durationSeconds: 60,
      text: `When you are ready, open your eyes. Return to your life.

But carry this integration with you.

In every experience, ask: Can I be in this AND aware of this?

The answer is always yes. The capacity is always there.

You are the experiencer. You are the witness. You are both.

So be it.`,
      soundscapeNotes: "Final integrated tone, unified, complete"
    }
  ]
};

// ============================================================
// CANTICLE 11: Synthesis
// Duration: ~14 minutes
// ============================================================

export const canticle11: CanticleScript = {
  id: 11,
  title: "Synthesis",
  durationMinutes: 14,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Four tones converging, all cycles combined, emergence"
    },
    {
      name: "Invocation",
      durationSeconds: 60,
      text: `Synthesis is not compromise. It is not taking a little from each tradition and diluting them all.

True synthesis is integration at a higher level—where distinct elements maintain their integrity while creating something emergent.

Unity without uniformity.

Integration without dissolution.

Welcome to the Synthesis Protocol.`,
      soundscapeNotes: "Four distinct tones, each clear, beginning to harmonize"
    },
    {
      name: "The Four Directions",
      durationSeconds: 90,
      text: `Stand in the center now. You are the synthesis point.

Around you, four directions. Four elements. Four wisdom traditions.

North: Earth. Vedic precision. System. Structure. Analysis.

East: Air. Sufi resonance. Heart. Emotion. Connection.

South: Fire. Kabbalistic boundaries. Protection. Foundation. Strength.

West: Water. Daoist flow. Natural order. Effortless movement.

Four distinct. Four essential. Four complete.`,
      soundscapeNotes: "Four distinct musical themes, each in its direction"
    },
    {
      name: "North - Earth/Vedic",
      durationSeconds: 75,
      text: `Turn to the North. Face Earth. The Vedic tradition.

Feel its precision. Its systematic approach. Its analytical rigor.

This is the wisdom of clear thinking. Of exact measurement. Of structured practice.

Honor this direction. This element. This tradition.

It brings clarity. System. Method.

You need this.`,
      soundscapeNotes: "Vedic/Earth music—precise, structured, grounded"
    },
    {
      name: "East - Air/Sufi",
      durationSeconds: 75,
      text: `Turn to the East. Face Air. The Sufi tradition.

Feel its resonance. Its emotional depth. Its heart-centered knowing.

This is the wisdom of love. Of devotion. Of the heart's intelligence.

Honor this direction. This element. This tradition.

It brings warmth. Connection. Presence.

You need this.`,
      soundscapeNotes: "Sufi/Air music—flowing, emotional, heart-opening"
    },
    {
      name: "South - Fire/Kabbalah",
      durationSeconds: 75,
      text: `Turn to the South. Face Fire. The Kabbalistic tradition.

Feel its boundaries. Its protective strength. Its foundational power.

This is the wisdom of limits. Of discernment. Of sacred container.

Honor this direction. This element. This tradition.

It brings safety. Definition. Structure.

You need this.`,
      soundscapeNotes: "Kabbalistic/Fire music—strong, protective, defined"
    },
    {
      name: "West - Water/Daoist",
      durationSeconds: 75,
      text: `Turn to the West. Face Water. The Daoist tradition.

Feel its flow. Its natural order. Its effortless movement.

This is the wisdom of yielding. Of following nature. Of wu wei—action through non-action.

Honor this direction. This element. This tradition.

It brings flexibility. Adaptation. Ease.

You need this.`,
      soundscapeNotes: "Daoist/Water music—flowing, adaptive, natural"
    },
    {
      name: "Return to Center",
      durationSeconds: 90,
      text: `Return to center now.

You have visited all four directions. You have honored all four elements. You have recognized the wisdom of all four traditions.

Now hold them. All four. Simultaneously.

Not blended into mush. Not competing for dominance.

Integrated. Distinct. Unified.`,
      soundscapeNotes: "All four themes playing together, distinct but harmonious"
    },
    {
      name: "The Emergent Property",
      durationSeconds: 90,
      text: `From this integration, something emerges.

Not present in any single tradition. Not achievable by following only one path.

Something new. Something unique to you. Your synthesis.

Feel it now. The emergent wisdom. Your personal integration of these four.

This is your synthesis protocol. Your unique contribution. Your integrated path.`,
      soundscapeNotes: "Emergence, new melody arising from the four, unique synthesis"
    },
    {
      name: "Rest in Synthesis",
      durationSeconds: 90,
      text: `Rest now in this synthesis.

All four elements present. All four traditions honored. All four directions accessible.

And from their integration: emergence.

You are not less than any single tradition. You are more. You are the synthesis.

Rest in this knowing.

[Silence for 45 seconds]`,
      soundscapeNotes: "Full synthesis harmony, emergence continuing, peace"
    },
    {
      name: "Commitment",
      durationSeconds: 60,
      text: `Commit now to your synthesis. To not choosing one path over others.

To being the integration. The emergent property. The unique expression.

Your synthesis will be different from others. This is right. This is how it should be.

Honor all four. Express your unique integration.

This is the path of synthesis.`,
      soundscapeNotes: "Resolute synthesis, commitment to integration"
    },
    {
      name: "Closing",
      durationSeconds: 60,
      text: `When you are ready, open your eyes. Return to your life.

But carry this synthesis with you.

When you need precision: turn North. When you need heart: turn East. When you need boundaries: turn South. When you need flow: turn West.

And always, return to center. Your synthesis. Your integration.

You are the harmony of four. The emergence of one.

So be it.`,
      soundscapeNotes: "Final synthesis chord, all elements united, silence"
    }
  ]
};

// ============================================================
// CANTICLE 12: New Beginning
// Duration: ~15 minutes
// ============================================================

export const canticle12: CanticleScript = {
  id: 12,
  title: "New Beginning",
  durationMinutes: 15,
  sections: [
    {
      name: "Opening",
      durationSeconds: 30,
      text: "",
      soundscapeNotes: "Full orchestral, emergence, silence, new breath"
    },
    {
      name: "Invocation",
      durationSeconds: 60,
      text: `This is not an ending.

It is not even a transformation of what was.

It is a new architecture entirely—a consciousness system designed from first principles to preserve and enhance self-awareness at every scale.

Welcome to the New Beginning.`,
      soundscapeNotes: "Orchestral emergence, building, new possibility"
    },
    {
      name: "The Review",
      durationSeconds: 90,
      text: `You have journeyed through eleven chapters. Eleven practices. Eleven transformations.

Fluid self. Signal awareness. Boundaries. Chemical messengers. Crossroads choices. Calibration. Sigils. Debugging. Heart resonance. Witness integration. Synthesis.

Each a stepping stone. Each a preparation. Each essential.

Review them now. Feel how they have changed you.`,
      soundscapeNotes: "Review of previous themes, brief echoes of all canticles"
    },
    {
      name: "The Architect",
      durationSeconds: 90,
      text: `You are no longer the subject of transformation. You are the architect of it.

You have learned the tools. You know the practices. You understand the principles.

Now you design. You build. You create your own architecture of consciousness.

This is the shift: from student to architect. From follower to creator. From subject to sovereign.`,
      soundscapeNotes: "Architectural, building, designing, creative power"
    },
    {
      name: "The Old Architecture",
      durationSeconds: 90,
      text: `Look back at the old architecture. The consciousness system you inherited. The patterns installed by culture, family, trauma, adaptation.

It served its purpose. It got you here. It kept you alive.

But you have outgrown it. You see its limitations. You feel its constraints.

Honor it. Thank it. Release it.

The old architecture can rest now.`,
      soundscapeNotes: "Nostalgic, honoring, letting go, closure"
    },
    {
      name: "The Design Principles",
      durationSeconds: 90,
      text: `Now consider the principles of your new architecture:

Fluidity over rigidity.
Awareness over reaction.
Boundaries appropriate to context.
Emotional wisdom honored without tyranny.
Conscious choice at every crossroads.
Regular calibration.
Symbolic power utilized.
Pattern debugging as habit.
Heart resonance as foundation.
Witness integration as baseline.
Synthesis as ongoing practice.

These are your design specs.`,
      soundscapeNotes: "Clear, principled, architectural precision"
    },
    {
      name: "The Commitment",
      durationSeconds: 90,
      text: `Commit now to your new architecture.

Not perfectly. Not immediately. But consistently. Persistently.

You will build it one choice at a time. One practice at a time. One day at a time.

The architecture is not built in a moment. It is built in a thousand moments.

Each moment of awareness. Each moment of choice. Each moment of witness.

These are the building blocks of your new reality.`,
      soundscapeNotes: "Building, construction, steady progress"
    },
    {
      name: "The Inauguration",
      durationSeconds: 90,
      text: `Now inaugurate this new architecture.

Speak your commitment. Declare your intention. Seal this new beginning with your word.

"I am the architect of my consciousness. I design my reality. I choose my responses. I witness my experience. I resonate with life. I synthesize wisdom. I am becoming."

These are not empty words. They are code. They compile in your subconscious. They shape your reality.`,
      soundscapeNotes: "Inaugural, ceremonial, powerful, declarative"
    },
    {
      name: "The First Breath",
      durationSeconds: 90,
      text: `Take the first breath of your new architecture.

Feel how it moves through you differently. How awareness infuses the breath. How witness observes the breathing. How the heart resonates with life.

This is the first breath of a new cosmos. Your cosmos. Designed by you. Inhabited by you. Experienced by you.

The architecture holds. The system is online. The new beginning has begun.`,
      soundscapeNotes: "First breath, new cosmos, system activation"
    },
    {
      name: "The Path Forward",
      durationSeconds: 90,
      text: `The path forward is not mapped. You will create it as you walk it.

There will be challenges. Old patterns will call. External pressures will push.

But you have the architecture now. You have the tools. You have the witness. You have the resonance.

You are equipped for this journey. You are ready for this becoming.

The path unfolds one step at a time.`,
      soundscapeNotes: "Forward motion, unfolding, readiness, courage"
    },
    {
      name: "Rest in New Architecture",
      durationSeconds: 90,
      text: `Rest now in your new architecture.

Feel its solidity. Its intelligence. Its capacity.

You are not who you were when you began this journey. You are someone new. Something new.

An architect. A creator. A consciousness designing itself.

Rest in this knowing. This becoming. This new beginning.

[Silence for 45 seconds]`,
      soundscapeNotes: "Peaceful new architecture, solid, intelligent, ready"
    },
    {
      name: "Closing",
      durationSeconds: 90,
      text: `When you are ready, open your eyes. Return to your life.

But return as architect. As creator. As consciousness designing itself.

The old patterns will call. Let them call.

The new architecture holds. You are held.

Build wisely. Witness clearly. Love fully. Choose consciously.

This is your new beginning. The first day of your new architecture.

May it serve you. May it serve all beings. May it serve the evolution of consciousness itself.

The canticles are complete. Your practice begins.

So be it.`,
      soundscapeNotes: "Full orchestral conclusion, emergence, completion, silence"
    }
  ]
};

// ============================================================
// EXPORTS
// ============================================================

export const allCanticles: CanticleScript[] = [
  canticle1, canticle2, canticle3,
  canticle4, canticle5, canticle6,
  canticle7, canticle8, canticle9,
  canticle10, canticle11, canticle12
];

export function getCanticleById(id: number): CanticleScript | undefined {
  return allCanticles.find(c => c.id === id);
}

export function getTotalCanticleDuration(): number {
  return allCanticles.reduce((sum, c) => sum + c.durationMinutes, 0);
}

export function getCanticleStats() {
  return {
    totalCanticles: allCanticles.length,
    totalDurationMinutes: getTotalCanticleDuration(),
    totalDurationHours: Math.round(getTotalCanticleDuration() / 60 * 10) / 10,
    averageDurationMinutes: Math.round(getTotalCanticleDuration() / allCanticles.length)
  };
}

export default allCanticles;
