
import { supabase } from '@/lib/supabase';

interface ProcessingTask {
  documentId: string;
  storagePath: string;
  type: string;
  priority: number;
}

export class DocumentProcessingQueue {
  private static queue: ProcessingTask[] = [];
  private static processing = false;

  static async addTask(task: ProcessingTask) {
    this.queue.push(task);
    console.log(`Added document ${task.documentId} to processing queue`);
    
    if (!this.processing) {
      await this.processQueue();
    }
  }

  private static async processQueue() {
    if (this.queue.length === 0 || this.processing) return;

    this.processing = true;
    const task = this.queue.shift();

    if (!task) {
      this.processing = false;
      return;
    }

    try {
      console.log(`Processing document ${task.documentId}`);
      
      // Update document status to processing
      await supabase
        .from('documents')
        .update({ 
          ai_processing_status: 'processing',
          metadata: {
            processing_started: new Date().toISOString()
          }
        })
        .eq('id', task.documentId);

      // Trigger the analysis edge function
      const { error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentId: task.documentId,
          storagePath: task.storagePath,
          documentType: task.type
        }
      });

      if (error) throw error;

    } catch (error) {
      console.error(`Error processing document ${task.documentId}:`, error);
      
      // Update document status to failed
      await supabase
        .from('documents')
        .update({ 
          ai_processing_status: 'failed',
          metadata: {
            processing_error: error.message,
            processing_failed_at: new Date().toISOString()
          }
        })
        .eq('id', task.documentId);
    } finally {
      this.processing = false;
      // Process next document if any
      if (this.queue.length > 0) {
        await this.processQueue();
      }
    }
  }
}
